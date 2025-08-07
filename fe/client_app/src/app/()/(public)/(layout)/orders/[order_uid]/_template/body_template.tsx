"use client";

import { OrderApi } from "@/api/client/order_api";
import { useCancleOrder } from "@/api/state/order/useCancleOrder";
import { useCreatePaymentOrder } from "@/api/state/payment/useCreatePaymentOrder";
import { Order } from "@/api/type/order";
import { getMessageApi } from "@/context/MessageContext";
import { OrderStatusModel } from "@/model/order_status_model";
import { formatCurrencyVND, formatDateTimeVN } from "@/util/format_util";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Descriptions, Flex } from "antd";
import React from "react";
import ProductListAndReviewComponent from "./ProductListAndReviewComponent";

interface OrderDetailBodyTemplateProps {
  order_uid: string;
}

const OrderDetailBodyTemplate: React.FC<OrderDetailBodyTemplateProps> = ({
  order_uid,
}) => {
  const { data: order_data, refetch: refetchOrderData } = useQuery<Order>({
    queryKey: ["read_order", order_uid],
    queryFn: () => OrderApi.readByUid(order_uid),
    staleTime: 0,
  });

  const udpate_status_mutation = useMutation({
    mutationFn: (status: string) => OrderApi.updateStatus(order_uid, status),
    onSuccess: () => {
      getMessageApi().success("Đã cập nhật!");
      refetchOrderData();
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "Có lỗi xảy ra");
    },
  });

  function handleCancled(): void {
    udpate_status_mutation.mutate(OrderStatusModel.CANCELLED);
  }

  function handleDelivired(): void {
    udpate_status_mutation.mutate(OrderStatusModel.DELIVERED);
  }

  function handleFailed(): void {
    udpate_status_mutation.mutate(OrderStatusModel.FAILED);
  }

  function handleBuyAgain(): void {
    // future logic
  }

  const { cancleOrder, loading: cancleOrderLoading } = useCancleOrder(() =>
    refetchOrderData()
  );
  const { create: createPaymentOrder, loading: createPaymentLoading } =
    useCreatePaymentOrder(() => refetchOrderData());

  return (
    <Flex vertical gap={50}>
      <Descriptions
        bordered
        column={1}
        styles={{
          label: { fontWeight: "bold", width: "150px" },
          content: { maxWidth: "500px" },
        }}
      >
        <Descriptions.Item label="Mã phiếu">
          {order_data?.uid}
        </Descriptions.Item>
        <Descriptions.Item label="Người nhận hàng">
          {order_data?.recipientName}
        </Descriptions.Item>
        <Descriptions.Item label="SĐT người nhận">
          {order_data?.recipientPhone}
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ giao hàng">
          {order_data?.address}
        </Descriptions.Item>
        <Descriptions.Item label="Ghi chú">
          {order_data?.note}
        </Descriptions.Item>
        <Descriptions.Item label="Tiền ship">
          {formatCurrencyVND(order_data?.shippingAmount)}
        </Descriptions.Item>
        <Descriptions.Item label="Tiền hàng">
          {formatCurrencyVND(order_data?.totalAmount)}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền">
          {formatCurrencyVND(
            (order_data?.totalAmount || 0) + (order_data?.shippingAmount || 0)
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {order_data?.status}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {formatDateTimeVN(order_data?.createdAt)}
        </Descriptions.Item>
        {/* <Descriptions.Item label="Cập nhật lần cuối">
          {formatDateTimeVN(order_data?.updated_at!)}
        </Descriptions.Item> */}
      </Descriptions>

      {order_data && order_data.status == "Chưa thanh toán" && (
        <Flex gap={10}>
          <Button
            loading={createPaymentLoading}
            type="primary"
            onClick={() => createPaymentOrder(order_uid)}
          >
            Thanh toán
          </Button>
          <Button
            loading={cancleOrderLoading}
            type="primary"
            danger
            onClick={() => cancleOrder(order_uid)}
          >
            Hủy đơn
          </Button>
        </Flex>
      )}

      {/* <ProductListInOrderComponent
                order_uid={order_uid}
            /> */}

      {/* <ProductListAndReviewComponent
                order_uid={order_uid}
                status={order_data?.status as string}

            /> */}

      <ProductListAndReviewComponent
        order_uid={order_uid}
        status_uid={order_data?.status || ""}
      />

      {order_data && (
        <Flex gap={10} wrap>
          {order_data.status == OrderStatusModel.PENDING && (
            <Button type="primary" onClick={() => handleCancled()} danger>
              Hủy đơn
            </Button>
          )}

          {order_data.status == OrderStatusModel.SHIPPED && (
            <>
              <Button type="primary" onClick={() => handleDelivired()}>
                Đã nhận hàng
              </Button>
              <Button type="primary" onClick={() => handleFailed()} danger>
                Không nhận được hàng
              </Button>
            </>
          )}
          {/* 
                    {order_data.status == OrderStatusModel.DELIVERED && (
                        <ReviewFormComponent order_uid={order_uid} />
                    )} */}

          {order_data.status == OrderStatusModel.CANCELLED && (
            <Button type="primary" onClick={() => handleBuyAgain()}>
              Mua lại
            </Button>
          )}
        </Flex>
      )}
    </Flex>
  );
};

export default OrderDetailBodyTemplate;
