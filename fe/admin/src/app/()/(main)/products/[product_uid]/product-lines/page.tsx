'use client'

import { useAddProductLine } from '@state/product/useAddProductLine';
import { useProduct } from '@state/product/useProduct';
import { useProductProductLineList } from '@state/product/useProductProductLineList';
import { useRemoveProductLine } from '@state/product/useRemoveProductLine';
import { ProductLine } from '@type/product_line';
import { Breadcrumb, Button, Col, Flex, Row, Table, TableColumnsType } from 'antd';
import Link from 'antd/es/typography/Link';
import React, { use, useMemo } from 'react';

interface ProductProductLineManagePageProps {
    params: Promise<{ product_uid: string }>
}

const ProductProductLineManagePage: React.FC<ProductProductLineManagePageProps> = ({ params }) => {
    const { product_uid } = use(params);

    const { data: productData, isLoading: productLoading } = useProduct({ product_uid })

    const { data: product_line_connected_datas, isLoading: connectedLoading, refetch: refetchProductLineConnectedDatas } = useProductProductLineList(product_uid, true)

    const { data: product_line_not_connected_datas, isLoading: notConnectedLoading, refetch: refetchProductLineNotConnectedDatas } = useProductProductLineList(product_uid, false)


    const onSuccess = () => {
        refetchProductLineConnectedDatas();
        refetchProductLineNotConnectedDatas();
    }

    const { addProductLine } = useAddProductLine(onSuccess);
    const { removeProductLine } = useRemoveProductLine(onSuccess);

    const columns_no_added: TableColumnsType<ProductLine> = useMemo(
        () => [
            {
                title: "UID",
                dataIndex: "uid",
                key: "uid",
            },
            {
                title: "Tên",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Thao tác",
                key: "actions",
                width: 100,
                render: (_, record: ProductLine) => (
                    <Flex gap={10} wrap>
                        <Button type='primary' onClick={() => addProductLine({
                            product_uid, product_line_uid: record.uid
                        })}>
                            Thêm
                        </Button>
                    </Flex>
                ),
            },
        ],
        [product_line_connected_datas]
    );

    const columns_added: TableColumnsType<ProductLine> = useMemo(
        () => [
            {
                title: "UID",
                dataIndex: "uid",
                key: "uid",
            },
            {
                title: "Tên",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Thao tác",
                key: "actions",
                width: 100,
                render: (_, record: ProductLine) => (
                    <Flex gap={10} wrap>
                        <Button type='primary' danger onClick={() => removeProductLine({
                            product_uid, product_line_uid: record.uid
                        })}>
                            Gỡ
                        </Button>
                    </Flex>
                ),
            },
        ],
        [product_line_connected_datas]
    );


    return <>
        <Flex vertical gap={50}>
            <Breadcrumb items={[
                {
                    title: <Link href="/home">Trang chủ</Link>,
                },
                {
                    title: <Link href="/products">Sản phẩm</Link>
                }, {
                    title: <Link href={`/products/${product_uid}`}>{productData?.name}</Link>
                }, {
                    title: "Product lines"
                },
            ]} />
            <Row gutter={[20, 20]}>
                <Col xs={24} md={12}>
                    <Table
                        pagination={false}
                        rowKey="uid"
                        dataSource={product_line_connected_datas?.content}
                        columns={columns_added}
                        loading={connectedLoading}
                    />
                </Col>
                <Col xs={24} md={12}>
                    <Table
                        pagination={false}
                        rowKey="uid"
                        dataSource={product_line_not_connected_datas?.content}
                        columns={columns_no_added}
                        loading={notConnectedLoading}
                    />
                </Col>
            </Row>
        </Flex>
    </>

};

export default ProductProductLineManagePage;