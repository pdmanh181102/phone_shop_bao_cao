"use client";

import { formatDateTimeVN } from "@/uitl/format_util";
import ReceiptComponent from "@component/receipt_component";
import StaffComponent from "@component/staff_component";
import { useDeleteBrand } from "@state/brand/useDeleteBrand";
import { useImportList } from "@state/import/useImportList";
import { useAntdTableState } from "@state/useAntdTableState";
import { InventoryEntry } from "@type/inventory_entry";
import { Breadcrumb, Button, Flex, Table, Tag } from "antd";
import Link from "antd/es/typography/Link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ImportSupplierInfoComponent from "./_component/import_supplier_info_component";

const ImportManagePage = () => {
  const router = useRouter();

  const { delete: deleteBrand } = useDeleteBrand(() => refetch());

  const { pagination, sorter, filters, handleTableChange, setPagination } =
    useAntdTableState();

  const { data, isLoading, refetch } = useImportList({
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
      title: "Nhân viên tạo",
      render: (_: any, record: InventoryEntry) => (
        <StaffComponent staffUid={record.staffUid} />
      ),
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplierUid",
      render: (supplierUid: string) => (
        <ImportSupplierInfoComponent supplier_uid={supplierUid} />
      ),
    },
    {
      title: "Lý do nhập",
      dataIndex: "reason",
    },
    {
      title: "Trạng thái",
      render: (_: any, record: InventoryEntry) => (
        <ReceiptComponent
          entryUid={record.uid}
          component={({ receipt }) => {
            if (!!!receipt) return <Tag color="red">Chưa nhận hàng</Tag>;
            return <Tag color="blue">Đã nhận hàng</Tag>;
          }}
        />
      ),
    },
    {
      title: "Ngày nhập",
      dataIndex: "createdAt",
      sorter: true,
      render: (createdAt: Date) => formatDateTimeVN(createdAt),
    },
    {
      title: "Thao tác",
      render: (_: any, record: InventoryEntry) => (
        <Button
          size="small"
          type="primary"
          onClick={() => router.push(`/imports/${record.uid}`)}
        >
          Chi tiết
        </Button>
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
            title: "Nhập kho",
          },
        ]}
      />
      <Flex gap={10}>
        <Button
          size="small"
          type="primary"
          onClick={() => router.push(`/imports/create`)}
        >
          Tạo phiếu nhập
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
    </Flex>
  );
};

export default ImportManagePage;
