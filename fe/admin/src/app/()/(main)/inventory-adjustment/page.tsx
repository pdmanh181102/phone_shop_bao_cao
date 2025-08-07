"use client";

import { formatDateTimeVN } from "@/uitl/format_util";
import StaffComponent from "@component/staff_component";
import { useInventoryAdjustmentList } from "@state/inventory_adjustment/useInventoryAdjustmentList";
import { useAntdTableState } from "@state/useAntdTableState";
import { InventoryAdjustment } from "@type/inventory_adjustment";
import { Breadcrumb, Button, Flex, Table, TableColumnsType } from "antd";
import Link from "antd/es/typography/Link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

const InventoryAdjustmentManagePage = () => {
  const router = useRouter();

  const { pagination, sorter, filters, handleTableChange, setPagination } =
    useAntdTableState();

  const { data, isLoading, refetch } = useInventoryAdjustmentList({
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

  const columns: TableColumnsType<InventoryAdjustment> = useMemo(
    () => [
      {
        title: "UID",
        dataIndex: "uid",
        key: "uid",
      },
      {
        title: "Lý do",
        dataIndex: "reason",
        key: "reason",
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date: Date) => formatDateTimeVN(date),
      },
      {
        title: "Nhân viên",
        key: "staff",
        render: (_, record: InventoryAdjustment) => (
          <StaffComponent staffUid={record.staffUid} />
        ),
      },
      {
        title: "Thao tác",
        key: "actions",
        width: 100,
        render: (_, record: InventoryAdjustment) => (
          <Flex gap={10} wrap>
            <Button
              type="link"
              size="small"
              href={`/inventory-adjustment/${record.uid}`}
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
            title: "Điều chỉnh tồn kho",
          },
        ]}
      />
      <Flex gap={10}>
        <Button
          size="small"
          type="primary"
          onClick={() => {
            router.push(`/inventory-adjustment/create`);
          }}
        >
          Điều chỉnh
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

export default InventoryAdjustmentManagePage;
