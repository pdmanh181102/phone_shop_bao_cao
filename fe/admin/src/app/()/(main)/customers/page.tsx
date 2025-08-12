"use client";

import SmallImageComponent from "@component/small_image";
import { useCustomerList } from "@state/customer/useCustomerList";
import { useAntdTableState } from "@state/useAntdTableState";
import { Customer } from "@type/customer";
import { Breadcrumb, Button, Flex, Table } from "antd";
import Link from "antd/es/typography/Link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CustomersManagePage = () => {
  const router = useRouter();

  const [openDialog, setOpenDialog] = useState<string>("closed");

  const { pagination, sorter, filters, handleTableChange, setPagination } =
    useAntdTableState();

  const { data, isLoading, refetch } = useCustomerList({
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
      title: "Họ",
      dataIndex: "firstName",
      sorter: true,
    },
    {
      title: "Tên",
      dataIndex: "lastName",
      sorter: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      sorter: true,
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
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
      render: (_: any, record: Customer) => (
        <Flex gap={10}>
          <Button
            variant="solid"
            color="blue"
            size="small"
            onClick={() => router.push(`/customers/${record.uid}`)}
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
            title: "Khách hàng",
          },
        ]}
      />
      <Flex gap={10}>
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
    </Flex>
  );
};

export default CustomersManagePage;
