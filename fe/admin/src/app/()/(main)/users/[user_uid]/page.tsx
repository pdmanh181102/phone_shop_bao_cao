"use client";

import { formatDateTimeVN } from "@/uitl/format_util";
import LoadingScreen from "@component/loading_screen";
import { useUser } from "@state/user/useUser";
import { Breadcrumb, Button, Descriptions, Flex } from "antd";
import Link from "antd/es/typography/Link";
import Title from "antd/es/typography/Title";
import React, { use, useState } from "react";
import UserAccountComponent from "./_component/user_account_component";
import UpdateGenderDialog from "./_dialog/udpate_gender_dialog";
import UpdateFirsrtNameDialog from "./_dialog/update_first_name_dialog";
import UpdateLastNameDialog from "./_dialog/update_last_name_dialog";

interface UserDetailPageProps {
  params: Promise<{ user_uid: string }>;
}

const UserDetailPage: React.FC<UserDetailPageProps> = ({ params }) => {
  const { user_uid } = use(params);

  const [openDialog, setOpenDialog] = useState<string>("closed");

  const { data, isLoading, refetch } = useUser({ user_uid });

  if (isLoading) return <LoadingScreen />;

  return (
    <Flex vertical gap={20}>
      <Breadcrumb
        items={[
          {
            title: <Link href="/home">Home</Link>,
          },
          {
            title: <Link href="/users">Users</Link>,
          },
          {
            title: data?.uid,
          },
        ]}
      />

      <Title>Thông tin user</Title>

      {data && (
        <Descriptions
          column={1}
          styles={{
            label: { fontWeight: "bold", width: 150 },
            content: {
              width: 300,
            },
          }}
        >
          <Descriptions.Item label="UID">{data.uid}</Descriptions.Item>
          <Descriptions.Item label="Họ">{data.firstName}</Descriptions.Item>
          <Descriptions.Item label="Tên">{data.lastName}</Descriptions.Item>
          <Descriptions.Item label="Giới tính">{data.gender}</Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {formatDateTimeVN(data.createdAt)}
          </Descriptions.Item>
        </Descriptions>
      )}

      <Flex gap={10}>
        <Button
          size="small"
          type="primary"
          onClick={() => setOpenDialog("update_first_name")}
        >
          Đổi họ
        </Button>
        <Button
          size="small"
          type="primary"
          variant="solid"
          color="orange"
          onClick={() => setOpenDialog("update_last_name")}
        >
          Đổi tên
        </Button>
        <Button
          size="small"
          type="primary"
          variant="solid"
          color="pink"
          onClick={() => setOpenDialog("update_gender")}
        >
          Đổi giới tính
        </Button>
      </Flex>

      <>
        <UpdateFirsrtNameDialog
          user_uid={user_uid}
          open={openDialog === "update_first_name"}
          onCancel={() => setOpenDialog("closded")}
          onSuccess={() => {
            setOpenDialog("closded");
            refetch();
          }}
        />

        <UpdateLastNameDialog
          user_uid={user_uid}
          open={openDialog === "update_last_name"}
          onCancel={() => setOpenDialog("closded")}
          onSuccess={() => {
            setOpenDialog("closded");
            refetch();
          }}
        />

        <UpdateGenderDialog
          user_uid={user_uid}
          open={openDialog === "update_gender"}
          onCancel={() => setOpenDialog("closded")}
          onSuccess={() => {
            setOpenDialog("closded");
            refetch();
          }}
        />
      </>

      <UserAccountComponent user_uid={user_uid} />
    </Flex>
  );
};

export default UserDetailPage;
