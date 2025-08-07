'use client'

import { formatDateTimeVN } from "@/uitl/format_util";
import { useExportList } from "@state/export/useExportList";
import { useAntdTableState } from "@state/useAntdTableState";
import { InventoryExport } from "@type/inventory_export";
import { Breadcrumb, Button, Flex, Table } from "antd";
import Link from "antd/es/typography/Link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ImportManagePage = () => {

    const router = useRouter();

    const {
        pagination,
        sorter,
        filters,
        handleTableChange,
        setPagination,
    } = useAntdTableState();

    const { data, isLoading, refetch } = useExportList({
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
            title: "Mã đơn hàng",
            dataIndex: "orderUid",
            render: (orderUid: string) => <>{orderUid}</>
        },
        {
            title: "Lý do xuất kho",
            dataIndex: "reason",
            render: (name: string, record: InventoryExport) => <Link href={`/exports/${record.uid}`} >{name}</Link>
        },
        {
            title: "Ngày xuất kho",
            dataIndex: "createdAt",
            sorter: true,
            render: (createdAt: Date) => formatDateTimeVN(createdAt)
        },
    ];

    return <Flex vertical gap={20}>
        <Breadcrumb items={[
            {
                title: <Link href="/home">Home</Link>,
            },
            {
                title: "Xuất kho"
            },
        ]} />
        <Flex gap={10}>
            <Button size="small" onClick={() => refetch()}>Tải lại trang</Button>
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
};

export default ImportManagePage;
