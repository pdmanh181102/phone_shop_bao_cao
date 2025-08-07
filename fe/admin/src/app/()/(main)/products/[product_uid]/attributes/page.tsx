"use client";

import LoadingScreen from "@component/loading_screen";
import { useProduct } from "@state/product/useProduct";
import { useDeleteProductAttribute } from "@state/product_attribute/useDeleteProductAttribute";
import { useProductAttributeList } from "@state/product_attribute/useProductAttributeList";
import { ProductAttribute } from "@type/product.attribute";
import { Breadcrumb, Button, Flex, Popconfirm, Table } from "antd";
import Link from "antd/es/typography/Link";
import React, { use, useMemo, useState } from "react";
import AttributeItemsComponent from "./_component/attribute_items_component";
import CreateProductAttributeDialog from "./_dialog/create_product_attribute_dialog";

interface ProductAttributeManagePageProps {
  params: Promise<{ product_uid: string }>;
}

const ProductAttributeManagePage: React.FC<ProductAttributeManagePageProps> = ({
  params,
}) => {
  const [openDialog, setOpenDialog] = useState<string>("closed");

  const { product_uid } = use(params);
  const { data: productData, isLoading: productLoading } = useProduct({
    product_uid,
  });
  const { data, isLoading, refetch } = useProductAttributeList(product_uid);

  const { delete: deleteProductAttribute } = useDeleteProductAttribute(() =>
    refetch()
  );

  const columns = useMemo(
    () => [
      {
        title: "Thuộc tính",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Giá trị",
        key: "value",
        render: (_: any, record: ProductAttribute) => (
          <AttributeItemsComponent attributeUid={record.uid} />
        ),
      },
      {
        title: "Nhóm",
        dataIndex: "groupName",
        key: "groupName",
      },
      {
        title: "Thao tác",
        key: "actions",
        width: 100,
        render: (_: any, record: ProductAttribute) => (
          <Flex gap={10}>
            <Popconfirm
              title="Xóa"
              description={`Xóa hình ảnh?`}
              onConfirm={() => deleteProductAttribute(record.uid)}
              okText="Xóa"
              cancelText="Hủy"
              okType="danger"
            >
              <Button danger size="small" type="primary">
                Xóa
              </Button>
            </Popconfirm>
          </Flex>
        ),
      },
    ],
    []
  );

  if (isLoading || productLoading) return <LoadingScreen />;

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
            title: (
              <Link href={`/products/${product_uid}`}>{productData?.name}</Link>
            ),
          },
          {
            title: "Attributes",
          },
        ]}
      />
      <Flex>
        <Button
          size="small"
          type="primary"
          onClick={() => setOpenDialog("create")}
        >
          Thêm thuộc tính
        </Button>
      </Flex>
      <Table
        rowKey={"uid"}
        dataSource={data?.content}
        columns={columns}
        loading={isLoading}
      />
      {openDialog === "create" && (
        <CreateProductAttributeDialog
          product_uid={product_uid}
          open={openDialog === "create"}
          onCancel={() => setOpenDialog("closed")}
          onSuccess={() => {
            setOpenDialog("closed");
            refetch();
          }}
        />
      )}
    </Flex>
  );
};

export default ProductAttributeManagePage;
