import { useProductBrand } from "@state/product/useProductBrand";
import React from "react";

interface ProductBrandItemComponentProps {
  product_uid: string;
}

const ProductBrandItemComponent: React.FC<ProductBrandItemComponentProps> = ({
  product_uid,
}) => {
  const { data: brand_data } = useProductBrand({ product_uid });

  return <span>{brand_data?.name}</span>;
};

export default ProductBrandItemComponent;
