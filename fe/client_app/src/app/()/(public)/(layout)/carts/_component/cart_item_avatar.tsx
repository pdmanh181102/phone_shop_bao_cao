"use client";

import { useProductAvatar } from "@/api/state/product/useProductAvatar";
import { Image, Spin } from "antd";
import React from "react";

interface CartItemAvatarComponentProps {
  productUid: string;
}

const CartItemAvatarComponent: React.FC<CartItemAvatarComponentProps> = ({
  productUid,
}) => {
  const { data, isPending } = useProductAvatar(productUid);

  if (isPending) return <Spin />;

  return <> {data && <Image width={100} src={data.photoUrl} />}</>;
};

export default CartItemAvatarComponent;
