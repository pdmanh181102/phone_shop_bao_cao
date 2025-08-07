import { ProductPhotoApi } from "@/api/client/product_photo_api";
import { ProductPhoto } from "@/api/type/product";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import SmallImageComponent from "./small_image";

interface ProductAvatarItemComponentProps {
  product_uid: string;
}

const ProductAvatarItemComponent: React.FC<ProductAvatarItemComponentProps> = ({
  product_uid,
}) => {
  const { data: photo_data } = useQuery<ProductPhoto>({
    queryKey: ["read_product_avatar", product_uid],
    queryFn: () => ProductPhotoApi.readProductAvatar(product_uid),
    staleTime: 0,
  });

  return photo_data?.photoUrl ? (
    <SmallImageComponent src={photo_data?.photoUrl} />
  ) : (
    "N/A"
  );
};

export default ProductAvatarItemComponent;
