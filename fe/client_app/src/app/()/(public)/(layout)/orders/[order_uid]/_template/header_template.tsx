"use client";

import { OrderApi } from "@/api/client/order_api";
import { Order } from "@/api/type/order";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface OrderDetailHeaderTemplateProps {
  order_uid: string;
}

const OrderDetailHeaderTemplate: React.FC<OrderDetailHeaderTemplateProps> = ({
  order_uid,
}) => {
  const { data: data } = useQuery<Order>({
    queryKey: ["read_order", order_uid],
    queryFn: () => OrderApi.readByUid(order_uid),
    staleTime: 0,
  });

  return <></>;
};

export default OrderDetailHeaderTemplate;
