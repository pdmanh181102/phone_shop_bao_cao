"use client";

import { useAntdTableState } from "@state/useAntdTableState";
import { useUserList } from "@state/user/useUserList";
import { User } from "@type/user";
import { Breadcrumb, Button, Flex, Table } from "antd";
import Link from "antd/es/typography/Link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CreateUserDialog from "./_dialog/create_user_dialog";

const UsersManagePage = () => {
  const router = useRouter();

  const [openDialog, setOpenDialog] = useState<string>("closed");

  const { pagination, sorter, filters, handleTableChange, setPagination } =
    useAntdTableState();

  const { data, isLoading, refetch } = useUserList({
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
      title: "Giới tính",
      dataIndex: "gender",
      sorter: true,
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 100,
      render: (_: any, record: User) => (
        <Flex gap={10} wrap>
          <Button
            type="primary"
            size="small"
            onClick={() => router.push(`/users/${record.uid}`)}
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
            title: "Users",
          },
        ]}
      />
      <Flex gap={10}>
        <Button
          size="small"
          type="primary"
          onClick={() => setOpenDialog("create")}
        >
          Thêm
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
      <CreateUserDialog
        open={openDialog === "create"}
        onCancel={() => setOpenDialog("closed")}
        onSuccess={() => {
          refetch();
          setOpenDialog("closed");
        }}
      />
    </Flex>
  );
};

export default UsersManagePage;
