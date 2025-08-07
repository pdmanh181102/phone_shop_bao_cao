"use client";

import { formatCurrencyVND, formatDateTimeVN } from "@/uitl/format_util";
import StaffComponent from "@component/staff_component";
import { useOrderList } from "@state/order/useOrderList";
import { useAntdTableState } from "@state/useAntdTableState";
import { Order } from "@type/order";
import { Breadcrumb, Button, Flex, Table } from "antd";
import Link from "antd/es/typography/Link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const OrderManagePage = () => {
  const router = useRouter();

  const [openDialog, setOpenDialog] = useState<string>("closed");

  const { pagination, sorter, filters, handleTableChange, setPagination } =
    useAntdTableState();

  const { data, isLoading, refetch } = useOrderList({
    pagination,
    sorter,
    filters,
  });

  useEffect(() => {
    if (data?.totalElements) {
      setPagination((prev) => ({
        ...prev,
        total: data.totalElements,
      }));
    }
  }, [data?.totalElements]);

  const columns = [
    {
      title: "Uid",
      dataIndex: "uid",
      render: (uid: string) => <Link href={`/orders/${uid}`}>{uid}</Link>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      sorter: true,
      render: (status: string) => <>{status}</>,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      sorter: true,
      render: (totalAmount: number) => <>{formatCurrencyVND(totalAmount)}</>,
    },
    {
      title: "SĐT người nhận",
      dataIndex: "recipientPhone",
      render: (recipientPhone: string) => <>{recipientPhone}</>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      sorter: true,
      render: (createdAt: Date) => <>{formatDateTimeVN(createdAt)}</>,
    },
    {
      title: "Nhân viên duyệt",
      render: (_: any, record: Order) => (
        <StaffComponent staffUid={record.staffUid} />
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 100,
      render: (_: any, record: Order) => (
        <Flex gap={10} wrap>
          <Button
            type="primary"
            size="small"
            onClick={() => router.push(`/orders/${record.uid}`)}
          >
            Chi tiết
          </Button>
        </Flex>
      ),
    },
  ];

  return (
    <Flex vertical gap={20}>
      <Breadcrumb
        items={[
          {
            title: <Link href="/home">Home</Link>,
          },
          {
            title: "Đơn hàng",
          },
        ]}
      />

      <Flex gap={10}>
        <Button
          size="small"
          type="primary"
          onClick={() => router.push("/orders/create")}
        >
          Thêm đơn hàng
        </Button>
      </Flex>
      <Table
        rowKey="uid"
        columns={columns}
        dataSource={data?.content || []}
        loading={isLoading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </Flex>
  );
};

export default OrderManagePage;
