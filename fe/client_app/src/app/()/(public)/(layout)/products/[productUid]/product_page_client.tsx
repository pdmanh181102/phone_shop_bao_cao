"use client";

import { useProduct } from "@/api/state/product/useProduct";
import { useProductAttributesMutation } from "@/api/state/product/useProductAttributesMutation";
import { Product, ProductAttribute } from "@/api/type/product";
import { Col, Flex, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import ProductAttributeComponent from "./_component/product_attribute_component";
import ProductInfoComponent from "./_component/product_info_component";
import ProductPhotoComponent from "./_component/product_photo_component";
import ProductReviewListComponent from "./_component/product_review_component";

interface ProductPageClientProps {
  productUid: string;
}

const ProductPageClient: React.FC<ProductPageClientProps> = ({
  productUid,
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [attributes, setAttributes] = useState<ProductAttribute[] | null>(null);

  const { mutate: fetchProduct, isPending: fetchProductPendding } = useProduct(
    (result) => setProduct(result)
  );

  const { mutate: fetchProductAttributes, isPending: fetchAttributePendding } =
    useProductAttributesMutation((result) => setAttributes(result));

  useEffect(() => {
    fetchProduct(productUid);
    fetchProductAttributes(productUid);
  }, []);

  return (
    <>
      {product ? (
        <div className="overflow-x-hidden max-w-screen px-4">
          <Row justify={"center"}>
            <Col md={{ span: 20 }}>
              <Flex vertical gap={30}>
                <Row gutter={30}>
                  <Col xs={24} lg={12}>
                    <ProductPhotoComponent productUid={productUid} />
                  </Col>
                  <Col xs={23} lg={12}>
                    <ProductInfoComponent product={product} />
                  </Col>
                </Row>
                {attributes && (
                  <ProductAttributeComponent attributes={attributes} />
                )}
                <ProductReviewListComponent productUid={productUid} />
              </Flex>
            </Col>
          </Row>
        </div>
      ) : (
        <Spin />
      )}
    </>
  );
};

export default ProductPageClient;
