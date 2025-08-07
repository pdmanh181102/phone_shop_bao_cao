'use client'

import SmallImageComponent from "@component/small_image";
import { useDeleteSupplier } from "@state/supplier/useDeleteSupplier";
import { useSupplierList } from "@state/supplier/useSupplierList";
import { useAntdTableState } from "@state/useAntdTableState";
import { Brand } from "@type/brand";
import { Breadcrumb, Button, Flex, Popconfirm, Table } from "antd";
import Link from "antd/es/typography/Link";
import { useEffect, useState } from "react";
import CreateSupplierDialog from "./_dialog/create_supplier_dialog";

const BrandsManagePage = () => {

    const [openDialog, setOpenDialog] = useState<string>("closed");

    const { delete: deleteSupplier } = useDeleteSupplier(() => refetch());

    const {
        pagination,
        sorter,
        filters,
        handleTableChange,
        setPagination,
    } = useAntdTableState();

    const { data, isLoading, refetch } = useSupplierList({
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
            render: (name: string, record: Brand) => <Link href={`/suppliers/${record.uid}`} >{name}</Link>
        }, {
            title: "Hình ảnh",
            dataIndex: "photoUrl",
            key: "photo",
            render: (url: string) => (url ? <SmallImageComponent src={url} /> : "N/A"),
        }, {
            title: "Thao tác",
            key: "actions",
            width: 100,
            render: (_: any, record: Brand) => (
                <Flex gap={10} wrap>
                    <Popconfirm
                        title="Xóa"
                        description={`Xóa "${record.name}"?`}
                        onConfirm={() => deleteSupplier(record.uid)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okType="danger"
                    >
                        <Button type="primary" danger size="small" >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Flex>
            ),
        },
    ];

    return <Flex vertical gap={20}>
        <Breadcrumb items={[
            {
                title: <Link href="/home">Home</Link>,
            },
            {
                title: "Nhà cung cấp"
            },
        ]} />
        <Flex gap={10}>
            <Button size="small" type="primary" onClick={() => setOpenDialog("create")}>Thêm nhà cung cấp</Button>
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
        <CreateSupplierDialog
            open={openDialog == "create"}
            onCancel={() => setOpenDialog("closed")}
            onSuccess={() => { setOpenDialog("closed"); refetch() }} />
    </Flex>


};

export default BrandsManagePage;
