"use client";

import { useProductAvatar } from "@/api/state/product/useProductAvatar";
import { Skeleton } from "antd";
import React from "react";

interface ProductAvatarComponentProps {
  productUid: string;
}

const ProductAvatarComponent: React.FC<ProductAvatarComponentProps> = ({
  productUid,
}) => {
  const { data, isPending } = useProductAvatar(productUid);

  if (isPending) <Skeleton.Image active style={{ width: "100%" }} />;

  return (
    <>
      {" "}
      {data && (
        <div style={{ height: "150px" }}>
          <img src={data.photoUrl} alt="photo" />
        </div>
      )}
    </>
  );
};

export default ProductAvatarComponent;
