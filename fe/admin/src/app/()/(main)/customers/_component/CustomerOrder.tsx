import { formatCurrencyVND, formatDateTimeVN } from "@/uitl/format_util";
import { CustomerApi } from "@api/customer_api";
import { getMessageApi } from "@context/MessageContext";
import { Order } from "@type/order";
import { Table, Tabs, TabsProps } from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useMemo, useState } from "react";

interface CustomerOrdersProps {
  customterUid: string;
}

const CustomerOrders: React.FC<CustomerOrdersProps> = ({ customterUid }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("Tất cả");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!customterUid) return;
        const data = await CustomerApi.readAllOrder(customterUid);
        setOrders(data);
        setFilteredOrders(data); // mặc định là tất cả
      } catch {
        getMessageApi().error("Không thể tải lịch sử đơn hàng");
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    if (statusFilter === "Tất cả") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((o) => o.status === statusFilter));
    }
  }, [statusFilter, orders]);

  const tabItems: TabsProps["items"] = useMemo(() => {
    const statusSet = new Set(orders.map((o) => o.status));
    const statusTabs = Array.from(statusSet).map((status) => ({
      key: status,
      label: status,
    }));

    return [{ key: "Tất cả", label: "Tất cả" }, ...statusTabs];
  }, [orders]);

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Lịch sử đơn hàng</Title>

      <Tabs
        defaultActiveKey="Tất cả"
        items={tabItems}
        onChange={(key) => setStatusFilter(key)}
        style={{ marginBottom: 16 }}
      />

      <Table
        dataSource={filteredOrders}
        rowKey="uid"
        pagination={{ pageSize: 10 }}
      >
        <Table.Column<Order> title="Mã đơn" dataIndex="uid" />
        <Table.Column<Order> title="Người nhận" dataIndex="recipientName" />
        <Table.Column<Order> title="Số điện thoại" dataIndex="recipientPhone" />
        <Table.Column<Order> title="Địa chỉ" dataIndex="address" />
        <Table.Column<Order>
          title="Tiền hàng"
          render={(o: Order) => formatCurrencyVND(o.totalAmount)}
        />
        <Table.Column<Order>
          title="Tiền ship"
          render={(o: Order) => formatCurrencyVND(o.shippingAmount)}
        />
        <Table.Column<Order>
          title="Tổng tiền"
          render={(o: Order) =>
            formatCurrencyVND(o.totalAmount + o.shippingAmount)
          }
        />
        <Table.Column<Order> title="Trạng thái" dataIndex="status" />
        <Table.Column<Order>
          title="Ngày tạo"
          dataIndex="createdAt"
          render={(date) => formatDateTimeVN(date)}
        />
        <Table.Column<Order>
          title="Chi tiết"
          render={(order) => <a href={`/orders/${order.uid}`}>Xem chi tiết</a>}
        />
      </Table>
    </div>
  );
};

export default CustomerOrders;
