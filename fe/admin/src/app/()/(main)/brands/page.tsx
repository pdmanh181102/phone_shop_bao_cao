"use client";

import SmallImageComponent from "@component/small_image";
import { useBrandList } from "@state/brand/useBrandList";
import { useDeleteBrand } from "@state/brand/useDeleteBrand";
import { useAntdTableState } from "@state/useAntdTableState";
import { Brand } from "@type/brand";
import {
  Breadcrumb,
  Button,
  Dropdown,
  Flex,
  MenuProps,
  Popconfirm,
  Table,
} from "antd";
import Link from "antd/es/typography/Link";
import { useEffect, useState } from "react";
import CreateBrandDialog from "./_dialog/create_brand_dialog";
import { useRouter } from "next/navigation";
import { FaImage } from "react-icons/fa";
import DropDownMenuComponent from "@component/select_menu_component";

const BrandsManagePage = () => {
  const router = useRouter();

  const [openDialog, setOpenDialog] = useState<string>("closed");

  const { delete: deleteBrand } = useDeleteBrand(() => refetch());

  const { pagination, sorter, filters, handleTableChange, setPagination } =
    useAntdTableState();

  const { data, isLoading, refetch } = useBrandList({
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

  const columns = [
    {
      title: "Uid",
      dataIndex: "uid",
    },
    {
      title: "Tên",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "Hình ảnh",
      dataIndex: "photoUrl",
      key: "photo",
      render: (url: string) =>
        url ? <SmallImageComponent src={url} /> : "N/A",
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 100,
      render: (_: any, record: Brand) => (
        <Flex gap={10}>
          <Popconfirm
            title="Xóa thương hiệu"
            description={`Xóa thương hiệu "${record.name}"?`}
            onConfirm={() => deleteBrand(record.uid)}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
          >
            <Button type="primary" danger size="small">
              Xóa
            </Button>
          </Popconfirm>
          <Button
            variant="solid"
            color="blue"
            size="small"
            onClick={() => router.push(`/brands/${record.uid}`)}
          >
            Chi tiết
          </Button>
        </Flex>
      ),
    },
  ];

  return (
    <Flex vertical gap={20}>
      <Breadcrumb
        items={[
          {
            title: <Link href="/home">Home</Link>,
          },
          {
            title: "Thương hiệu",
          },
        ]}
      />
      <Flex gap={10}>
        <Button
          size="small"
          type="primary"
          onClick={() => setOpenDialog("create")}
        >
          Thêm thương hiệu
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
      />
      <CreateBrandDialog
        open={openDialog == "create"}
        onCancel={() => setOpenDialog("closed")}
        onSuccess={() => {
          setOpenDialog("closed");
          refetch();
        }}
      />
    </Flex>
  );
};

export default BrandsManagePage;
