"use client";

import { formatCurrencyVND, formatDateTimeVN } from "@/uitl/format_util";
import LoadingScreen from "@component/loading_screen";
import DropDownMenuComponent from "@component/select_menu_component";
import { useCancleOrder } from "@state/order/useCancleOrder";
import { useComfirmOrder } from "@state/order/useComfirmOrder";
import { useOrder } from "@state/order/useOrder";
import { useRefundOrder } from "@state/order/useRefundOrder";
import { useShipFailedOrder } from "@state/order/useShipFailedOrder";
import { useShippedOrder } from "@state/order/useShippedOrder";
import { useCreatePaymentOrder } from "@state/payment/useCreatePaymentOrder";
import { Breadcrumb, Descriptions, Flex, MenuProps, Tag } from "antd";
import Link from "antd/es/typography/Link";
import React, { use, useMemo } from "react";
import { FaToggleOn } from "react-icons/fa";
import OrderItemsComponent from "./_component/order_items_component";

interface OrderDetailPageProps {
  params: Promise<{ order_uid: string }>;
}

const OrderDetailPage: React.FC<OrderDetailPageProps> = ({ params }) => {
  const { order_uid } = use(params);

  const { data, isLoading, refetch } = useOrder({ order_uid });

  console.log(data);

  const { comfirmOrder, loading: comfirmOrderLoading } = useComfirmOrder(() =>
    refetch()
  );
  const { cancleOrder, loading: cancleOrderLoading } = useCancleOrder(() =>
    refetch()
  );
  const { shippedOrder, loading: shippedOrderLoading } = useShippedOrder(() =>
    refetch()
  );
  const { shipFailedOrder, loading: shipFailedOrderLoading } =
    useShipFailedOrder(() => refetch());

  const { refundOrder, loading: refundOrderLoading } = useRefundOrder(() =>
    refetch()
  );
  const { create: createPaymentOrder, loading: createPaymentLoading } =
    useCreatePaymentOrder(() => refetch());

  const items: MenuProps["items"] = useMemo(() => {
    const itms: MenuProps["items"] = [];

    if (data) {
      if (
        data.statusUid == "CHUA_THANH_TOAN" ||
        data.statusUid == "CHO_XU_LY" ||
        data.statusUid == "GIAO_HANG_THAT_BAI"
      ) {
        itms.push({
          key: "huy",
          label: (
            <div className="flex items-center gap-2">
              <FaToggleOn /> <Tag color="red">Hủy</Tag>
            </div>
          ),
          onClick: () => cancleOrder({ order_uid: data.uid }),
        });
      }
      if (data.statusUid == "CHUA_THANH_TOAN") {
        itms.push({
          key: "thanh_toan",
          label: (
            <div className="flex items-center gap-2">
              <FaToggleOn /> <Tag color="blue">Thanh toán</Tag>
            </div>
          ),
          onClick: () => createPaymentOrder({ order_uid: data.uid }),
        });
      }
      if (data.statusUid == "CHO_XU_LY") {
        itms.push({
          key: "xac_nhan",
          label: (
            <div className="flex items-center gap-2">
              <FaToggleOn /> <Tag color="blue">Xác nhận đơn hàng</Tag>
            </div>
          ),
          onClick: () => comfirmOrder({ order_uid: data.uid }),
        });
      }
      if (data.statusUid == "DANG_GIAO_HANG") {
        itms.push({
          key: "giao_hang_thanh_cong",
          label: (
            <div className="flex items-center gap-2">
              <FaToggleOn /> <Tag color="blue">Đã giao hàng</Tag>
            </div>
          ),
          onClick: () => shippedOrder({ order_uid: data.uid }),
        });
        itms.push({
          key: "giao_hang_that_bai",
          label: (
            <div className="flex items-center gap-2">
              <FaToggleOn /> <Tag color="red">Giao hàng thất bại</Tag>
            </div>
          ),
          onClick: () => shipFailedOrder({ order_uid: data.uid }),
        });
      }
      if (data.statusUid == "GIAO_HANG_THAT_BAI") {
        itms.push({
          key: "giao_hang",
          label: (
            <div className="flex items-center gap-2">
              <FaToggleOn /> <Tag color="blue">Giao lại</Tag>
            </div>
          ),
          onClick: () => comfirmOrder({ order_uid: data.uid }),
        });
      }
      if (
        data.statusUid == "DA_HUY" &&
        data.paid == true &&
        data.paymentMethod == "ZaloPay"
      ) {
        itms.push({
          key: "hoan_tien",
          label: (
            <div className="flex items-center gap-2">
              <FaToggleOn /> <Tag color="blue">Hoàn tiền</Tag>
            </div>
          ),
          onClick: () => refundOrder({ order_uid: data.uid }),
        });
      }
    }
    return itms;
  }, [data]);

  if (isLoading) return <LoadingScreen />;

  return (
    <Flex vertical gap={50}>
      <Breadcrumb
        items={[
          {
            title: <Link href="/home">Home</Link>,
          },
          {
            title: <Link href="/orders">Orders</Link>,
          },
          {
            title: data?.uid,
          },
        ]}
      />
      {data && (
        <Descriptions
          column={1}
          styles={{
            label: { fontWeight: "bold", width: 150 },
            content: {
              width: 300,
            },
          }}
        >
          <Descriptions.Item label="UID">{data.uid}</Descriptions.Item>
          <Descriptions.Item label="Tên người nhận">
            {data.recipientName}
          </Descriptions.Item>
          <Descriptions.Item label="SĐT người nhận">
            {data.recipientPhone}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú">{data.note}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ người nhận">
            {data.address}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {formatDateTimeVN(data.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color="blue"> {data.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Phương thức thanh toán">
            <Tag color="orange"> {data.paymentMethod}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Thành tiền">
            {formatCurrencyVND(data.totalAmount)}
          </Descriptions.Item>
          <Descriptions.Item label="Tiền ship">
            {formatCurrencyVND(data.shippingAmount)}
          </Descriptions.Item>
          <Descriptions.Item label="Phải thanh toán">
            <Tag color="blue">
              {formatCurrencyVND(data.totalAmount + data.shippingAmount)}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      )}

      {items && items.length > 0 && (
        <Flex>
          <DropDownMenuComponent text="Cập nhật trạng thái" items={items} />
        </Flex>
      )}

      <OrderItemsComponent order_uid={order_uid} />
    </Flex>
  );
};

export default OrderDetailPage;
