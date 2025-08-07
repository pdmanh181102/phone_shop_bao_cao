'use client'

import LoadingScreen from '@component/loading_screen';
import { useExport } from '@state/export/useExport';
import { Breadcrumb, Descriptions, Flex } from 'antd';
import Link from 'antd/es/typography/Link';
import React, { use } from 'react';
import ExportItemsComponent from './_component/import_items_component';

interface ImportDetailPageProps {
    params: Promise<{ export_uid: string }>
}

const ImportDetailPage: React.FC<ImportDetailPageProps> = ({ params }) => {

    const { export_uid } = use(params)

    const { data, isLoading } = useExport({ export_uid })

    if (isLoading) return <LoadingScreen />

    return <Flex vertical gap={50}>
        <Breadcrumb items={[
            {
                title: <Link href="/home">Home</Link>,
            },
            {
                title: <Link href="/exports">Xuất kho</Link>,
            },
            {
                title: data?.uid
            },

        ]} />
        {
            data && <Descriptions column={1} styles={{
                label: {
                    fontWeight: 'bold',
                    width: 150
                }
            }}>
                <Descriptions.Item label="Uid">
                    {data.uid}
                </Descriptions.Item>
                <Descriptions.Item label="Đơn hàng">
                    <Link href={`/orders/${data.orderUid}`}>{data.orderUid}</Link>
                </Descriptions.Item>
                <Descriptions.Item label="Lý do tạo phiếu">
                    {data.reason}
                </Descriptions.Item>
            </Descriptions>

        }
        <ExportItemsComponent export_uid={export_uid} />
    </Flex>

};

export default ImportDetailPage;