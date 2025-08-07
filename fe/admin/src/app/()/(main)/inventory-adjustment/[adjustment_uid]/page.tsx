'use client'

import LoadingScreen from '@component/loading_screen';
import { useInventoryAdjustment } from '@state/inventory_adjustment/useInventoryAdjustment';
import { Breadcrumb, Descriptions, Flex } from 'antd';
import Link from 'antd/es/typography/Link';
import React, { use } from 'react';
import InventoryAdjustmentItemsComponent from './_component/inventory_adjustment_items_component';

interface ImportDetailPageProps {
    params: Promise<{ adjustment_uid: string }>
}

const ImportDetailPage: React.FC<ImportDetailPageProps> = ({ params }) => {

    const { adjustment_uid } = use(params)

    const { data, isLoading } = useInventoryAdjustment({ adjustment_uid })

    if (isLoading) return <LoadingScreen />

    return <Flex vertical gap={50}>
        <Breadcrumb items={[
            {
                title: <Link href="/home">Home</Link>,
            },
            {
                title: <Link href="/inventory-adjustment">Điều chỉnh tồn kho</Link>,
            },
            {
                title: data?.uid
            },
        ]} />
        {
            data && <Descriptions column={1} styles={{
                label: {
                    fontWeight: 'bold'
                }
            }}>
                <Descriptions.Item label="Uid">
                    {data.uid}
                </Descriptions.Item>
                <Descriptions.Item label="Lý do tạo phiếu">
                    {data.reason}
                </Descriptions.Item>
            </Descriptions>
        }
        <InventoryAdjustmentItemsComponent adjustment_uid={adjustment_uid} />
    </Flex>

};

export default ImportDetailPage;