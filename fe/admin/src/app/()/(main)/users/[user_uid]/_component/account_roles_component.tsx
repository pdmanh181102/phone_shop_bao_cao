import LoadingScreen from '@component/loading_screen';
import { useAccountRole } from '@state/account/useAccountRole';
import { useRemoveRole } from '@state/account/useRemoveRole';
import { Role } from '@type/role';
import { Button, Flex, Popconfirm, Table } from 'antd';
import Title from 'antd/es/typography/Title';
import Link from 'next/link';
import React, { useState } from 'react';
import AddAccountRoleDialog from '../_dialog/add_account_role_dialog';

interface AccountRoleComponentProps {
    account_uid: string
}

const AccountRoleComponent: React.FC<AccountRoleComponentProps> = ({ account_uid }) => {

    const [openDialog, setOpenDialog] = useState<string>("closed");

    const { data: accountRoleDatas, isLoading, refetch } = useAccountRole({ account_uid })

    const { do: removeRole } = useRemoveRole(refetch)

    const columns = [
        {
            title: "Uid",
            dataIndex: "uid",
        },
        {
            title: "Tên",
            dataIndex: "name",
            sorter: true,
            render: (name: string, record: Role) => <Link href={`/roles/${record.uid}`} >{name}</Link>
        }, {
            title: "Thao tác",
            key: "actions",
            width: 100,
            render: (_: any, record: Role) => (
                <Flex gap={10} wrap>
                    <Popconfirm
                        title="Gỡ"
                        description={`Gỡ "${record.name}"?`}
                        onConfirm={() => {
                            removeRole({ account_uid, role_uid: record.uid })
                        }}
                        okText="Xóa"
                        cancelText="Hủy"
                        okType="danger"
                    >
                        <Button type="primary" danger size="small" >
                            Gỡ
                        </Button>
                    </Popconfirm>
                </Flex>
            ),
        },
    ];

    if (isLoading) return <LoadingScreen />

    return <Flex vertical gap={10}>
        <Title level={4}>Account roles</Title>
        <Flex>
            <Button size='small' type='primary' onClick={() => setOpenDialog("add")}>Thêm</Button>
        </Flex>
        <Table
            rowKey="uid"
            columns={columns}
            dataSource={accountRoleDatas || []}
            loading={isLoading}
            pagination={false}
        />
        <AddAccountRoleDialog
            open={openDialog === "add"}
            account_uid={account_uid}
            onCancel={() => setOpenDialog("closed")}
            onSuccess={() => {
                setOpenDialog("closed");
                refetch()
            }}
        />
    </Flex>

};

export default AccountRoleComponent;