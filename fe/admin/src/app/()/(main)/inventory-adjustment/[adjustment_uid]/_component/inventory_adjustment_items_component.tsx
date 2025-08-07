"use client";

import { formatNumberVN } from "@/uitl/format_util";
import LoadingScreen from "@component/loading_screen";
import ProductAvatarItemComponent from "@component/product_avatar_item_component";
import { useInventoryAdjustmentItems } from "@state/inventory_adjustment/useInventoryAdjustmentItems";
import { useProductListByUids } from "@state/product/useProductListByUids";
import { Page } from "@type/page";
import { Product } from "@type/product";
import { Flex, Table, TableColumnsType } from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useMemo, useState } from "react";

interface InventoryAdjustmentItemsComponentProps {
  adjustment_uid: string;
}

const InventoryAdjustmentItemsComponent: React.FC<
  InventoryAdjustmentItemsComponentProps
> = ({ adjustment_uid }) => {
  const [productDatas, setProductDatas] = useState<Product[]>([]);

  const { data: importItemsData, isLoading } = useInventoryAdjustmentItems({
    adjustment_uid,
  });

  const { mutate: mutateProductList, isPending } = useProductListByUids(
    (productList: Page<Product>) => setProductDatas(productList.content)
  );

  useEffect(() => {
    if (importItemsData) {
      const product_uids: string[] = importItemsData.map(
        (item) => item.productUid
      );
      mutateProductList({ product_uids });
    }
  }, [importItemsData]);

  const getQuantity = (product_uid: string) => {
    if (!importItemsData) return 0;
    const q = importItemsData.find((item) => item.productUid == product_uid);
    if (q) return q.quantity;
    return 0;
  };

  const getBeforeQuantity = (product_uid: string) => {
    if (!importItemsData) return 0;
    const q = importItemsData.find((item) => item.productUid == product_uid);
    if (q) return q.beforeQuantity;
    return 0;
  };

  const columns: TableColumnsType<Product> = useMemo(
    () => [
      {
        title: "UID",
        dataIndex: "uid",
        key: "uid",
        width: "200px",
      },
      {
        title: "Tên sản phẩm",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Hình ảnh",
        key: "avatar",
        render: (_, record: Product) => (
          <ProductAvatarItemComponent product_uid={record.uid} />
        ),
      },
      {
        title: "Số lượng trước điều chỉnh",
        key: "quantity",
        render: (record: Product) =>
          formatNumberVN(getBeforeQuantity(record.uid)),
      },
      {
        title: "Số lượng sau điều chỉnh",
        key: "quantity",
        render: (record: Product) => formatNumberVN(getQuantity(record.uid)),
      },
    ],
    [importItemsData]
  );

  if (isLoading) return <LoadingScreen />;

  return (
    <Flex vertical gap={20}>
      <Title level={4}>Sản phẩm</Title>

      <Table
        pagination={false}
        scroll={{ x: "max-content" }}
        rowKey={"uid"}
        dataSource={productDatas}
        columns={columns}
        loading={isPending}
      />
    </Flex>
  );
};

export default InventoryAdjustmentItemsComponent;
