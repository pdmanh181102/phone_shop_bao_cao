'use client'

import { formatCurrencyVND, formatNumberVN } from '@/uitl/format_util';
import LoadingScreen from '@component/loading_screen';
import ProductAvatarItemComponent from '@component/product_avatar_item_component';
import { useExportItems } from '@state/export/useExportItems';
import { useProductListByUids } from '@state/product/useProductListByUids';
import { Page } from '@type/page';
import { Product } from '@type/product';
import { Flex, Table, TableColumnsType } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useMemo, useState } from 'react';

interface ExportItemsComponentProps {
    export_uid: string
}

const ExportItemsComponent: React.FC<ExportItemsComponentProps> = ({ export_uid }) => {

    const [productDatas, setProductDatas] = useState<Product[]>([]);

    const { data: exportItemsData, isLoading } = useExportItems({ export_uid })

    const { mutate: mutateProductList, isPending } = useProductListByUids((productList: Page<Product>) => setProductDatas(productList.content));

    useEffect(() => {
        if (exportItemsData) {
            console.log(exportItemsData);

            const product_uids: string[] = exportItemsData.map(item => item.productUid);
            mutateProductList({ product_uids });
        }
    }, [
        exportItemsData
    ]);



    const getQuantity = (product_uid: string) => {
        if (!exportItemsData) return 0;
        const q = exportItemsData.find(item => item.productUid == product_uid);
        if (q) return q.quantity;
        return 0;
    }

    const getUnitPrice = (product_uid: string) => {
        if (!exportItemsData) return 0;
        const q = exportItemsData.find(item => item.productUid == product_uid);
        if (q) return q.unitPrice;
        return 0;
    }

    const getTotalMoney = () => {
        if (!exportItemsData) return 0;
        let totalMoney = 0;
        exportItemsData.map(item => totalMoney += (item.quantity * (item.unitPrice)))
        return totalMoney;
    }


    const columns: TableColumnsType<Product> = useMemo(
        () => [
            {
                title: "UID",
                dataIndex: "uid",
                key: "uid",
                width: "200px"
            },
            {
                title: "Tên sản phẩm",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Hình ảnh",
                key: "avatar",
                render: (_, record: Product) => (<ProductAvatarItemComponent product_uid={record.uid} />)
            },
            {
                title: "Số lượng",
                key: "quantity",
                render: (record: Product) => formatNumberVN(getQuantity(record.uid))
            },
            {
                title: "Đơn giá xuất",
                key: "unitPrice",
                render: (record: Product) => formatCurrencyVND(getUnitPrice(record.uid))
            },
            {
                title: "Thành tiền",
                key: "totalMoney",
                render: (_, record: Product) => formatCurrencyVND((getQuantity(record.uid) * (getUnitPrice(record.uid) || 0)))
            }
        ], [exportItemsData])

    if (isLoading) return <LoadingScreen />


    return <Flex vertical gap={20}>
        <Title level={4}>Sản phẩm</Title>

        <Table pagination={false} scroll={{ x: 'max-content' }} rowKey={"uid"} dataSource={productDatas} columns={columns} loading={isPending} />

        <Flex align="end" justify="end" gap={10}>
            <Title level={5}>Tổng tiền: </Title>
            <Title level={5}>
                {formatCurrencyVND(getTotalMoney())}
            </Title>
        </Flex>

    </Flex>

};

export default ExportItemsComponent;