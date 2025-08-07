"use client";

import { RateTooltips } from "@/constance/product.c";
import { formatCurrencyVND, formatNumberVN } from "@/uitl/format_util";
import LoadingScreen from "@component/loading_screen";
import ProductBrandItemComponent from "@component/product_brand_item_component";
import DropDownMenuComponent from "@component/select_menu_component";
import { useProduct } from "@state/product/useProduct";
import {
  Breadcrumb,
  Col,
  Descriptions,
  Flex,
  MenuProps,
  Rate,
  Row,
} from "antd";
import Link from "antd/es/typography/Link";
import Title from "antd/es/typography/Title";
import { useRouter } from "next/navigation";
import React, { use, useState } from "react";
import { FaCogs, FaImage, FaTag, FaThList, FaToggleOn } from "react-icons/fa";
import ProductAttributeComponent from "./_component/product_attribute_component";
import ProductPhotoComponent from "./_component/product_photo_component";
import ProductProductLinesComponent from "./_component/product_product_line_component";
import ProductReviewListComponent from "./_component/product_review_component";
import UpdateProductPriceDialog from "./_dialog/update_product_price_dialog";
import UpdateProductStatusDialog from "./_dialog/update_product_status_dialog";

interface ProductDetailPageProps {
  params: Promise<{ product_uid: string }>;
}

const ACTIONS = {
  UPDATE_IMAGE: "1",
  UPDATE_STATUS: "2",
  UPDATE_PRICE: "3",
  UPDATE_PRDL: "4",
  UPDATE_ATTR: "5",
  NOTHING: "0",
};

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ params }) => {
  const { product_uid } = use(params);

  const router = useRouter();

  const [openDialog, setOpenDialog] = useState<string>(ACTIONS.NOTHING);

  const { data, isLoading, refetch } = useProduct({ product_uid });

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className="flex items-center gap-2">
          <FaImage /> Cập nhật hình ảnh
        </div>
      ),
      onClick: () => router.push(`/products/${product_uid}/photos`),
    },
    {
      key: "2",
      label: (
        <div className="flex items-center gap-2">
          <FaToggleOn /> Cập nhật trạng thái
        </div>
      ),
      onClick: () => setOpenDialog(ACTIONS.UPDATE_STATUS),
    },
    {
      key: "3",
      label: (
        <div className="flex items-center gap-2">
          <FaTag /> Cập nhật giá
        </div>
      ),
      onClick: () => setOpenDialog(ACTIONS.UPDATE_PRICE),
    },
    {
      key: "4",
      label: (
        <div className="flex items-center gap-2">
          <FaThList /> Cập nhật dòng sản phẩm
        </div>
      ),
      onClick: () => router.push(`/products/${product_uid}/product-lines`),
    },
    {
      key: "5",
      label: (
        <div className="flex items-center gap-2">
          <FaCogs /> Cập nhật thuộc tính
        </div>
      ),
      onClick: () => router.push(`/products/${product_uid}/attributes`),
    },
  ];

  if (isLoading) return <LoadingScreen />;

  return (
    <Flex vertical gap={20}>
      <Breadcrumb
        items={[
          {
            title: <Link href="/home">Trang chủ</Link>,
          },
          {
            title: <Link href="/products">Sản phẩm</Link>,
          },
          {
            title: data?.name,
          },
        ]}
      />
      <ProductProductLinesComponent product_uid={product_uid} />

      <Title level={1}>{data?.name}</Title>
      <Flex vertical gap={10}>
        <Row gutter={30}>
          <Col xs={{ span: 24 }} lg={{ span: 12 }}>
            <Flex vertical gap={10}>
              <ProductPhotoComponent product_uid={product_uid} />
            </Flex>
          </Col>
          <Col xs={{ span: 24 }} lg={{ span: 12 }}>
            <Flex vertical gap={20}>
              {data && (
                <Descriptions
                  column={1}
                  styles={{ label: { fontWeight: "bold" } }}
                >
                  <Descriptions.Item label="UID">{data.uid}</Descriptions.Item>
                  <Descriptions.Item label="Tên sản phẩm">
                    {data.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thương hiệu">
                    <ProductBrandItemComponent product_uid={data.uid} />
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    {data.status}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giá bán">
                    {formatCurrencyVND(data.price)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Đã nhập">
                    {formatNumberVN(data.enteredQuantity)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Đã bán">
                    {formatNumberVN(data.soldQuantity)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Hiện có">
                    {formatNumberVN(data.currentQuantity)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Đánh giá">
                    <Rate
                      allowHalf
                      value={data.star || 5}
                      tooltips={RateTooltips}
                      disabled
                      style={{ fontSize: "1rem" }}
                    />
                  </Descriptions.Item>
                </Descriptions>
              )}

              <Flex>
                <DropDownMenuComponent items={items} />
              </Flex>
            </Flex>
          </Col>
        </Row>

        <Row>
          <Col xs={{ span: 24 }} lg={{ span: 12 }}></Col>
          <Col xs={{ span: 24 }} lg={{ span: 12 }}>
            <Flex vertical gap={20}>
              <Title level={4}>Thông tin chi tiết</Title>
              <ProductAttributeComponent product_uid={product_uid} />
            </Flex>
          </Col>
        </Row>
      </Flex>
      <Flex gap={10}></Flex>
      <UpdateProductStatusDialog
        product_uid={product_uid}
        open={openDialog === ACTIONS.UPDATE_STATUS}
        onCancel={() => setOpenDialog(ACTIONS.NOTHING)}
        onSuccess={() => {
          setOpenDialog(ACTIONS.NOTHING);
          refetch();
        }}
      />

      <UpdateProductPriceDialog
        product_uid={product_uid}
        open={openDialog === ACTIONS.UPDATE_PRICE}
        onCancel={() => setOpenDialog(ACTIONS.NOTHING)}
        onSuccess={() => {
          setOpenDialog(ACTIONS.NOTHING);
          refetch();
        }}
      />

      <ProductReviewListComponent productUid={product_uid} />
    </Flex>
  );
};

export default ProductDetailPage;
