import React from "react";
import ProductPageClient from "./product_page_client";

interface ProductDetailPageProps {
  params: Promise<{ productUid: string }>;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = async ({
  params,
}) => {
  const { productUid } = await params;
  // const product = await fetchProductOnServer(productUid);
  // const attributes = await fetchProductAttributesOnServer(productUid);

  return <ProductPageClient productUid={productUid} />;
};

export default ProductDetailPage;
