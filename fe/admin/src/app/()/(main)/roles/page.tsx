"use client";

import { useDeleteRole } from "@state/role/useDeleteRole";
import { useRoleList } from "@state/role/useRoleList";
import { useAntdTableState } from "@state/useAntdTableState";
import { Role } from "@type/role";
import { Breadcrumb, Button, Flex, Popconfirm, Table } from "antd";
import Link from "antd/es/typography/Link";
import { useEffect, useState } from "react";
import CreateRoleDialog from "./_dialog/create_role_dialog";

const BrandsManagePage = () => {
  const [openDialog, setOpenDialog] = useState<string>("closed");
  const { delete: deleteRole } = useDeleteRole(() => refetch());

  const { pagination, sorter, filters, handleTableChange, setPagination } =
    useAntdTableState();

  const { data, isLoading, refetch } = useRoleList({
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
      render: (name: string, record: Role) => (
        <Link href={`/roles/${record.uid}`}>{name}</Link>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 100,
      render: (_: any, record: Role) => (
        <Flex gap={10} wrap>
          <Popconfirm
            title="Xóa"
            description={`Xóa: "${record.name}"?`}
            onConfirm={() => deleteRole(record.uid)}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
          >
            <Button type="primary" danger size="small">
              Xóa
            </Button>
          </Popconfirm>
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
            title: "Role",
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
      <CreateRoleDialog
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
