"use client";

import { formatCurrencyVND, formatNumberVN } from "@/uitl/format_util";
import LoadingScreen from "@component/loading_screen";
import ProductAvatarItemComponent from "@component/product_avatar_item_component";
import { useImportItems } from "@state/import/useImportItems";
import { useProductListByUids } from "@state/product/useProductListByUids";
import { Page } from "@type/page";
import { Product } from "@type/product";
import { Flex, Table, TableColumnsType } from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useMemo, useState } from "react";

interface ImportItemsComponentProps {
  import_uid: string;
}

const ImportItemsComponent: React.FC<ImportItemsComponentProps> = ({
  import_uid,
}) => {
  const [productDatas, setProductDatas] = useState<Product[]>([]);

  const { data: importItemsData, isLoading } = useImportItems({ import_uid });

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

  const getRealQuantity = (product_uid: string) => {
    if (!importItemsData) return 0;
    const q = importItemsData.find((item) => item.productUid == product_uid);
    if (q) return q.realQuantity;
    return 0;
  };

  const getUnitPrice = (product_uid: string) => {
    if (!importItemsData) return 0;
    const q = importItemsData.find((item) => item.productUid == product_uid);
    if (q) return q.unitPrice;
    return 0;
  };

  const getTotalMoney = () => {
    if (!importItemsData) return 0;
    let totalMoney = 0;
    importItemsData.map(
      (item) => (totalMoney += item.quantity * item.unitPrice)
    );
    return totalMoney;
  };

  const getRealTotalMoney = () => {
    if (!importItemsData) return 0;
    let totalMoney = 0;
    importItemsData.map(
      (item) => (totalMoney += item.realQuantity * item.unitPrice)
    );
    return totalMoney;
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
        title: "Số lượng",
        key: "quantity",
        render: (record: Product) => (
          <Flex vertical gap={10}>
            <Flex gap={10}>
              <strong>Số lượng dự kiến:</strong>
              {formatNumberVN(getQuantity(record.uid))}
            </Flex>
            <Flex gap={10}>
              <strong>Số lượng nhập:</strong>
              {formatNumberVN(getRealQuantity(record.uid))}
            </Flex>
          </Flex>
        ),
      },
      {
        title: "Đơn giá nhập",
        key: "unitPrice",
        render: (record: Product) =>
          formatCurrencyVND(getUnitPrice(record.uid)),
      },
      {
        title: "Thành tiền",
        key: "totalMoney",
        render: (_, record: Product) => (
          <Flex vertical gap={10}>
            <Flex gap={10}>
              <strong>Thành tiền dự kiến:</strong>
              {formatCurrencyVND(
                getQuantity(record.uid) * (getUnitPrice(record.uid) || 0)
              )}
            </Flex>
            <Flex gap={10}>
              <strong>Thành tiền nhập:</strong>
              {formatCurrencyVND(
                getRealQuantity(record.uid) * (getUnitPrice(record.uid) || 0)
              )}
            </Flex>
          </Flex>
        ),
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

      <Flex align="end" justify="end" gap={10}>
        <Title level={5}>Tổng tiền dự kiến: </Title>
        <Title level={5}>{formatCurrencyVND(getTotalMoney())}</Title>
      </Flex>
      <Flex align="end" justify="end" gap={10}>
        <Title level={5}>Tổng tiền nhập: </Title>
        <Title level={5}>{formatCurrencyVND(getRealTotalMoney())}</Title>
      </Flex>
    </Flex>
  );
};

export default ImportItemsComponent;
