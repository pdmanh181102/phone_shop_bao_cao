"use client";

import LoadingScreen from "@component/loading_screen";
import { useProductPhotoList } from "@state/product_photo/useProductPhotoList";
import { Carousel, Image } from "antd";
import React from "react";

interface ProductPhotoComponentProps {
  product_uid: string;
}

const ProductPhotoComponent: React.FC<ProductPhotoComponentProps> = ({
  product_uid,
}) => {
  const { data } = useProductPhotoList(product_uid);

  if (!data) return <LoadingScreen />;

  return (
    <Carousel
      autoplay={{ dotDuration: true }}
      autoplaySpeed={3000}
      arrows
      infinite
    >
      {data &&
        data.content.map((photo) => (
          <Image src={photo.photoUrl} key={photo.uid} />
        ))}
    </Carousel>
  );
};

export default ProductPhotoComponent;
