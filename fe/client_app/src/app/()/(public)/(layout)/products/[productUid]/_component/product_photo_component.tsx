"use client";

import React from "react";
import { Carousel, Flex, Image, Skeleton } from "antd";
import { useProductAvatar } from "@/api/state/product/useProductAvatar";
import { useProductPhotos } from "@/api/state/product/useProductPhotos";

interface ProductPhotoComponentProps {
  productUid: string;
}

const ProductPhotoComponent: React.FC<ProductPhotoComponentProps> = ({
  productUid,
}) => {
  const { data, isPending } = useProductPhotos(productUid);

  if (isPending) return <Skeleton.Image active />;

  return (
    <Carousel
      autoplay={{ dotDuration: true }}
      autoplaySpeed={3000}
      arrows
      infinite
    >
      {data &&
        data.map((photo) => <Image src={photo.photoUrl} key={photo.uid} />)}
    </Carousel>
  );
};

export default ProductPhotoComponent;
