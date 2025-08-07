import { useDeleteProductLine } from '@state/product_line/useDeleteProductLine';
import { useProductLineList } from '@state/product_line/useProductLineList';
import { useAntdTableState } from '@state/useAntdTableState';
import { ProductLine } from '@type/product_line';
import { Button, Flex, Popconfirm, Table } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useState } from 'react';
import CreateProductLineDialog from '../_dialog/create_product_line_dialog';
import UpdateProductLineNameDialog from '../_dialog/update_product_line_name_dialog';

interface ProductLineManageComponentProps {
    brand_uid: string
}

const ProductLineManageComponent: React.FC<ProductLineManageComponentProps> = ({ brand_uid }) => {

    const [openDialog, setOpenDialog] = useState<string>("closed");
    const [selectedUid, setSelectedUid] = useState<string>();


    const {
        pagination,
        sorter,
        filters,
        handleTableChange,
        setPagination,
    } = useAntdTableState();

    const { data, isLoading, refetch } = useProductLineList(brand_uid, {
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

    const { delete: deleteProductLine } = useDeleteProductLine(refetch);

    const columns = [
        {
            title: "Uid",
            dataIndex: "uid",
        },
        {
            title: "Tên",
            dataIndex: "name",
            sorter: true,
        }, {
            title: "Thao tác",
            key: "actions",
            width: 100,
            render: (_: any, record: ProductLine) => (
                <Flex gap={10}>
                    <Popconfirm
                        title="Xóa"
                        description={`Xóa "${record.name}"?`}
                        onConfirm={() => deleteProductLine(record.uid)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okType="danger"
                    >
                        <Button type="primary" danger size="small" >
                            Xóa
                        </Button>
                    </Popconfirm>
                    <Button type="primary" size="small" onClick={() => {
                        setSelectedUid(record.uid)
                        setOpenDialog("edit")
                    }} >
                        Đổi tên
                    </Button>
                </Flex>
            ),
        },
    ];

    return <Flex vertical gap={20} style={{ marginTop: "50px" }}>
        <Title level={3}>Dòng sản phẩm</Title>
        <Flex wrap>
            <Button type='primary' size='small' onClick={() => setOpenDialog("create")}>Thêm dòng sản phẩm</Button>
        </Flex>
        <Table
            rowKey="uid"
            columns={columns}
            dataSource={data?.content || []}
            loading={isLoading}
            pagination={pagination}
            onChange={handleTableChange}
        />
        {selectedUid && <UpdateProductLineNameDialog
            product_line_uid={selectedUid}
            brand_uid={brand_uid}
            open={openDialog == "edit"}
            onCancel={() => setOpenDialog("closed")}
            onSuccess={() => { setOpenDialog("closed"); refetch() }} />}
        <CreateProductLineDialog
            brand_uid={brand_uid}
            open={openDialog == "create"}
            onCancel={() => setOpenDialog("closed")}
            onSuccess={() => { setOpenDialog("closed"); refetch() }} />
    </Flex>

};

export default ProductLineManageComponent;