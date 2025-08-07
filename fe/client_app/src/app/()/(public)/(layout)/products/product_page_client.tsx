"use client";

import { useProductList } from "@/api/state/product/useProductList";
import { Product } from "@/api/type/product";
import { Col, Flex, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import CompareFloatingWidget from "./_component/compare_button";
import PaginationComponent from "./_component/pagination_component";
import ProductCardComponent from "./_component/product_card_component";
import ProductFilterComponent from "./_component/product_filter_component";
interface ProductPageClientProps {
  page?: number;
  brand?: string;
  search?: string;
}

interface PaginationType {
  pageSize: number;
  totalPages: number;
  pageNumber: number;
}

const ProductPageClient: React.FC<ProductPageClientProps> = ({
  page,
  brand,
  search,
}) => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [showCompareButton, setShowCompareButton] = useState(false);

  const { data, isPending } = useProductList({ page, brandUid: brand, search });

  useEffect(() => {
    if (data) {
      setProducts(data.content);
      setPagination({
        pageNumber: data.pageable.pageNumber,
        pageSize: data.pageable.pageSize,
        totalPages: data.totalPages,
      });
    }
  }, [data]);
  // Kiểm tra localStorage
  useEffect(() => {
    const checkCompareProducts = () => {
      const items = localStorage.getItem("compareProductUids");
      try {
        const parsed = JSON.parse(items || "[]");
        setShowCompareButton(Array.isArray(parsed) && parsed.length > 0);
      } catch {
        setShowCompareButton(false);
      }
    };

    // Kiểm tra ban đầu
    checkCompareProducts();

    window.addEventListener("storage", checkCompareProducts);

    return () => {
      window.removeEventListener("storage", checkCompareProducts);
    };
  }, []);
  return (
    <>
      {products ? (
        <Flex vertical gap={10}>
          <CompareFloatingWidget />
          <ProductFilterComponent />

          <Row
            gutter={[10, 10]}
            style={{
              padding: 10,
              width: "100%",
              margin: 0,
              overflowX: "hidden",
              flexWrap: "wrap",
            }}
          >
            {data?.content.map((product) => (
              <Col
                key={product.uid}
                xs={{
                  span: 12,
                }}
                sm={{
                  span: 8,
                }}
                md={{
                  span: 6,
                }}
                lg={{
                  span: 4,
                }}
              >
                <ProductCardComponent
                  uid={product.uid}
                  name={product.name}
                  status={product.status}
                  star={product.star}
                  sold={product.soldQuantity}
                  current={product.currentQuantity}
                  price={product.price}
                />
              </Col>
            ))}
          </Row>

          {pagination && (
            <PaginationComponent
              pageSize={pagination.pageSize}
              totalPages={pagination.totalPages}
              pageNumber={pagination.pageNumber}
            />
          )}
        </Flex>
      ) : (
        <Spin />
      )}
    </>
  );
};

export default ProductPageClient;
