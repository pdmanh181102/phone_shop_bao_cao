"use client";

import {
  getCurrentProductQuantity,
  getTotalProductQuantity,
} from "@/uitl/extract_util";
import { formatCurrencyVND, formatNumberVN } from "@/uitl/format_util";
import ProductAvatarItemComponent from "@component/product_avatar_item_component";
import ProductBrandItemComponent from "@component/product_brand_item_component";
import ProductFilterComponent from "@component/product_filter";
import { useDeleteProduct } from "@state/product/useDeleteProduct";
import { useProductList } from "@state/product/useProductList";
import { useAntdTableState } from "@state/useAntdTableState";
import { Product } from "@type/product";
import {
  Breadcrumb,
  Button,
  Flex,
  Popconfirm,
  Rate,
  Table,
  TableColumnsType,
} from "antd";
import Link from "antd/es/typography/Link";
import { useEffect, useMemo, useState } from "react";
import CreateProductDialog from "./_dialog/create_product_dialog";
import { RateTooltips } from "@/constance/product.c";
import { useRouter } from "next/navigation";

interface FilterProps {
  search: string;
  brand_uids: string[];
  status_uids: string[];
}

const init_filter_props: FilterProps = {
  search: "",
  brand_uids: [],
  status_uids: [],
};

const ProductManagePage = () => {
  const router = useRouter();

  const [openDialog, setOpenDialog] = useState<string>("closed");

  const [filter, setFilter] = useState<FilterProps>(init_filter_props);

  const { pagination, sorter, filters, handleTableChange, setPagination } =
    useAntdTableState();

  const { data, isLoading, refetch } = useProductList({
    filter,
    pagination,
    sorter,
    filters,
  });

  useEffect(() => {
    if (data?.totalElements) {
      setPagination((prev) => ({
        ...prev,
        total: data.totalElements,
      }));
    }
  }, [data?.totalElements]);

  const { delete: deleteProduct } = useDeleteProduct(refetch);

  const columns: TableColumnsType<Product> = useMemo(
    () => [
      {
        title: "UID",
        dataIndex: "uid",
        key: "uid",
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
        title: "Đánh giá",
        key: "rate",
        render: (_, record: Product) => (
          <Rate
            allowHalf
            value={record.star || 5}
            tooltips={RateTooltips}
            disabled
            style={{ fontSize: "1rem" }}
          />
        ),
      },
      {
        title: "Thương hiệu",
        key: "brand_uid",
        render: (_, record: Product) => (
          <ProductBrandItemComponent product_uid={record.uid} />
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
      },
      {
        title: "Thông tin",
        key: "infomations",
        render: (_, record: Product) => (
          <Flex vertical gap={10}>
            <Flex gap={10}>
              <strong>Đã bán: </strong>
              <span>{`${formatNumberVN(record.soldQuantity)}`}</span>
            </Flex>

            <Flex gap={10}>
              <strong>Hiện có: </strong>
              <span>{`${formatNumberVN(record.currentQuantity)}`}</span>
            </Flex>

            <Flex gap={10}>
              <strong>Giá bán: </strong>
              <span>{formatCurrencyVND(record.price)}</span>
            </Flex>
          </Flex>
        ),
      },
      {
        title: "Thao tác",
        key: "actions",
        width: 100,
        render: (_, record: Product) => (
          <Flex gap={10}>
            <Popconfirm
              title="Xóa sản phẩm"
              description={`Xóa sản phẩm "${record.name}"?`}
              onConfirm={() => deleteProduct(record.uid)}
              okText="Xóa"
              cancelText="Hủy"
              okType="danger"
            >
              <Button type="primary" danger size="small">
                Xóa
              </Button>
            </Popconfirm>
            <Button
              type="primary"
              size="small"
              onClick={() => (window.location.href = `/products/${record.uid}`)}
            >
              Chi tiết
            </Button>
          </Flex>
        ),
      },
    ],
    []
  );

  return (
    <Flex vertical gap={20}>
      <Breadcrumb
        items={[
          {
            title: <Link href="/home">Home</Link>,
          },
          {
            title: "Sản phẩm",
          },
        ]}
      />
      <ProductFilterComponent
        onChange={(
          search: string,
          brand_uids: string[],
          status_uids: string[]
        ) => {
          setFilter({ search, brand_uids, status_uids });
        }}
      />
      <Flex gap={10}>
        <Button
          size="small"
          type="primary"
          onClick={() => setOpenDialog("create")}
        >
          Thêm sản phẩm
        </Button>
        <Button size="small" onClick={() => refetch()}>
          Tải lại trang
        </Button>
      </Flex>
      <Table
        rowKey="uid"
        columns={columns}
        dataSource={data?.content || []}
        loading={isLoading}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: "max-content" }}
      />

      <CreateProductDialog
        open={openDialog === "create"}
        onCancel={() => setOpenDialog("closed")}
        onSuccess={() => {
          setOpenDialog("closed");
          refetch();
        }}
      />
    </Flex>
  );
};

export default ProductManagePage;
