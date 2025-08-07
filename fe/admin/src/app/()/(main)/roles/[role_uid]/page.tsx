'use client'

import LoadingScreen from '@component/loading_screen';
import { useRole } from '@state/role/useRole';
import { Breadcrumb, Button, Flex } from 'antd';
import Link from "antd/es/typography/Link";
import Title from 'antd/es/typography/Title';
import React, { use, useState } from 'react';
import RolePermissionComponent from './_component/role_permissions_component';
import UpdateRoleNameDialog from './_dialog/update_role_name_dialog';

interface BrandDetailPageProps {
    params: Promise<{ role_uid: string }>
}

const BrandDetailPage: React.FC<BrandDetailPageProps> = ({ params }) => {
    const { role_uid } = use(params);

    const [openDialog, setOpenDialog] = useState<string>("closed");

    const { data, isLoading, refetch } = useRole({ role_uid })

    if (isLoading) return <LoadingScreen />

    return <Flex vertical gap={20} >
        <Breadcrumb items={[
            {
                title: <Link href="/home">Home</Link>,
            },
            {
                title: <Link href="/roles">Role</Link>
            }, {
                title: data?.name
            },
        ]} />
        <Title level={1}>{data?.name}</Title>
        <Flex gap={10}>
            <Button size='small' type='primary' onClick={() => setOpenDialog("edit")}>Cập nhật tên</Button>
        </Flex>
        <RolePermissionComponent role_uid={role_uid} />
        <UpdateRoleNameDialog role_uid={role_uid} open={openDialog == "edit"} onCancel={() => setOpenDialog("closed")} onSuccess={() => { setOpenDialog("closed"); refetch() }} />
    </Flex>

};

export default BrandDetailPage;