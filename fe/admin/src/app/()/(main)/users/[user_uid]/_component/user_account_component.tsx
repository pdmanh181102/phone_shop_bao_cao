import LoadingScreen from '@component/loading_screen';
import { useActiveAccount } from '@state/account/useActiveAccount';
import { useDisableAccount } from '@state/account/useDisableAccount';
import { useUserAccount } from '@state/user/useUserAccount';
import { Button, Descriptions, Flex } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useState } from 'react';
import CreateUserAccountDialog from '../_dialog/create_user_account_dialog';
import FUpdateAccountPasswordDialog from '../_dialog/update_account_password_dialog';
import AccountRoleComponent from './account_roles_component';

interface UserAccountComponentProps {
    user_uid: string
}

const UserAccountComponent: React.FC<UserAccountComponentProps> = ({ user_uid }) => {

    const [openDialog, setOpenDialog] = useState<string>("closed");

    const { data: accountData, isLoading, error, refetch } = useUserAccount({ user_uid });

    const { do: disableAccount } = useDisableAccount(refetch);
    const { do: activeAccount } = useActiveAccount(refetch);

    if (isLoading) return <LoadingScreen />

    if (error) {
        return <Flex vertical gap={10}>
            <Title level={4}>Tài khoản</Title>
            <Flex>
                <Button size='small' type='primary' onClick={() => setOpenDialog("create")}>Tạo tài khoản</Button>
            </Flex>
            <CreateUserAccountDialog
                user_uid={user_uid}
                open={openDialog === "create"}
                onCancel={() => setOpenDialog("closed")}
                onSuccess={() => {
                    setOpenDialog("closed");
                    refetch();
                }}
            />
        </Flex>
    }

    return <Flex vertical gap={40}>
        {
            accountData && <>
                <Flex vertical gap={10}>
                    <Title level={4}>Tài khoản</Title>
                    <Descriptions column={1}
                        styles={{
                            label: { fontWeight: 'bold', width: 150 },
                            content: {
                                width: 300
                            }
                        }}>
                        <Descriptions.Item label="UID">
                            {accountData?.uid}
                        </Descriptions.Item>
                        <Descriptions.Item label="Username">
                            {accountData?.username}
                        </Descriptions.Item>
                        <Descriptions.Item label="Password">
                            ******
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            {accountData?.status}
                        </Descriptions.Item>
                    </Descriptions>
                    <Flex gap={10}>
                        <Button
                            size='small'
                            variant='solid'
                            color='blue'
                            onClick={() => setOpenDialog("update_password")}
                        >
                            Đổi mật khẩu</Button>
                        {
                            accountData.status === "Active" ?
                                <Button
                                    size='small'
                                    variant='solid'
                                    color='danger'
                                    onClick={() => disableAccount({ account_uid: accountData.uid })}>
                                    Disable
                                </Button> :
                                <Button
                                    size='small'
                                    variant='solid'
                                    color='green'
                                    onClick={() => activeAccount({ account_uid: accountData.uid })}>
                                    Active
                                </Button>
                        }
                    </Flex>
                </Flex>
                <AccountRoleComponent account_uid={accountData.uid} />
                <FUpdateAccountPasswordDialog
                    open={openDialog == "update_password"}
                    account_uid={accountData.uid}
                    onCancel={() => setOpenDialog("closed")}
                    onSuccess={() => {
                        setOpenDialog("closed");
                        refetch();
                    }}
                />
            </>
        }

    </Flex>

};

export default UserAccountComponent;