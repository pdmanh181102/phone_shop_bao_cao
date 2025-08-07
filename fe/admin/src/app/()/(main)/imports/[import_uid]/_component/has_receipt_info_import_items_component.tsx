"use client";

import { formatCurrencyVND, formatNumberVN } from "@/uitl/format_util";
import LoadingScreen from "@component/loading_screen";
import ProductAvatarItemComponent from "@component/product_avatar_item_component";
import { useImportItems } from "@state/import/useImportItems";
import { useProductListByUids } from "@state/product/useProductListByUids";
import { useReceiptItemsMutation } from "@state/receipt/useReceiptItemsMutation";
import { Page } from "@type/page";
import { Product } from "@type/product";
import { ReceiptItem } from "@type/receipt";
import { Flex, Table, TableColumnsType } from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useMemo, useState } from "react";
import { EntryItemProduct } from "../../../receipts/create/_component/import_items_component";

interface HasReceiptInfoImportItemsComponentProps {
  importUid: string;
  receiptUid: string;
}

const HasReceiptInfoImportItemsComponent: React.FC<
  HasReceiptInfoImportItemsComponentProps
> = ({ importUid, receiptUid }) => {
  const [productDatas, setProductDatas] = useState<EntryItemProduct[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const { fetch: fetchReceiptItems, loading: fetchReceiptItemLoading } =
    useReceiptItemsMutation((items: ReceiptItem[]) => {
      const newQuantities: Record<string, number> = {};
      items.forEach((item) => {
        newQuantities[item.entryItemUid] = item.quantity;
      });
      setQuantities(newQuantities);
    });

  const { data: importItemsData, isLoading } = useImportItems({
    import_uid: importUid,
  });

  const { mutate: mutateProductList, isPending } = useProductListByUids(
    (productList: Page<Product>) => {
      const merged: EntryItemProduct[] = productList.content.map((product) => {
        const matchedEntry = importItemsData?.find(
          (item) => item.productUid === product.uid
        );
        return {
          ...product,
          entryItemUid: matchedEntry?.uid || "", // fallback nếu không tìm thấy
        };
      });

      setProductDatas(merged);
    }
  );

  useEffect(() => {
    fetchReceiptItems(receiptUid);
  }, []);

  useEffect(() => {
    if (importItemsData) {
      const product_uids: string[] = importItemsData.map(
        (item) => item.productUid
      );
      mutateProductList({ product_uids });
    }
  }, [importItemsData]);

  const getQuantity = (entryItemUid: string) => {
    return quantities[entryItemUid] || 0;
  };

  const getQuantity1 = (product_uid: string) => {
    if (!importItemsData) return 0;
    const q = importItemsData.find((item) => item.productUid == product_uid);
    if (q) return q.quantity;
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
    importItemsData.forEach((item) => {
      const quantity = quantities[item.uid] ?? item.quantity;
      totalMoney += quantity * item.unitPrice;
    });

    return totalMoney;
  };

  const getTotalMoney1 = () => {
    if (!importItemsData) return 0;
    let totalMoney = 0;
    importItemsData.map(
      (item) => (totalMoney += item.quantity * item.unitPrice)
    );
    return totalMoney;
  };

  const columns: TableColumnsType<EntryItemProduct> = useMemo(
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
        render: (_, record: EntryItemProduct) => (
          <ProductAvatarItemComponent product_uid={record.uid} />
        ),
      },
      {
        title: "Số lượng nhập",
        key: "quantity",
        render: (record: EntryItemProduct) =>
          formatNumberVN(getQuantity1(record.uid)),
      },
      {
        title: "Đơn giá nhập",
        key: "unitPrice",
        render: (record: EntryItemProduct) =>
          formatCurrencyVND(getUnitPrice(record.uid)),
      },
      {
        title: "Thành tiền",
        key: "totalMoney",
        render: (_, record: EntryItemProduct) =>
          formatCurrencyVND(
            getQuantity1(record.uid) * (getUnitPrice(record.uid) || 0)
          ),
      },
      {
        title: "Thực tế nhập",
        key: "totalMoney",
        render: (_, record: EntryItemProduct) => (
          <>{formatNumberVN(getQuantity(record.entryItemUid))}</>
        ),
      },
      {
        title: "Thành tiền thực tế",
        key: "totalMoney",
        render: (_, record: EntryItemProduct) =>
          formatCurrencyVND(
            getQuantity(record.entryItemUid) * (getUnitPrice(record.uid) || 0)
          ),
      },
    ],
    [importItemsData, quantities]
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
        <Title level={5}>Tổng tiền nhập: </Title>
        <Title level={5}>{formatCurrencyVND(getTotalMoney1())}</Title>
      </Flex>

      <Flex align="end" justify="end" gap={10}>
        <Title level={5}>Tổng tiền thực tế: </Title>
        <Title level={5}>{formatCurrencyVND(getTotalMoney())}</Title>
      </Flex>
    </Flex>
  );
};

export default HasReceiptInfoImportItemsComponent;
