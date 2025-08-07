'use client'

import FileButton from '@component/file_button';
import LoadingScreen from '@component/loading_screen';
import SmallImageComponent from '@component/small_image';
import { useSupplier } from '@state/supplier/useSupplier';
import { useUpdateSupplierPhotoWithUpload } from '@state/supplier/useUpdateBrandPhotoWithUpload';
import { Breadcrumb, Flex } from 'antd';
import Link from "antd/es/typography/Link";
import Title from 'antd/es/typography/Title';
import React, { use } from 'react';

interface BrandDetailPageProps {
    params: Promise<{ supplier_uid: string }>
}

const BrandDetailPage: React.FC<BrandDetailPageProps> = ({ params }) => {
    const { supplier_uid } = use(params);

    const { data, isLoading } = useSupplier({ supplier_uid })

    const { uploadImage } = useUpdateSupplierPhotoWithUpload(supplier_uid);

    if (isLoading) return <LoadingScreen />

    return <Flex vertical gap={20} >
        <Breadcrumb items={[
            {
                title: <Link href="/home">Home</Link>,
            },
            {
                title: <Link href="/suppliers">Nhà cung cấp</Link>
            }, {
                title: data?.name
            },
        ]} />
        <Title level={1}>{data?.name}</Title>
        <Flex><SmallImageComponent src={data?.photoUrl} /></Flex>
        <Flex gap={10}>
            <FileButton size='small' onSelectFile={(file: File) => uploadImage(file)}>Cập nhật hình ảnh</FileButton>
        </Flex>
    </Flex>

};

export default BrandDetailPage;