"use client";
import { AuthStorage } from "@/uitl/auth_storage";
import { useAccount } from "@state/account/useAccount";
import { useUser } from "@state/user/useUser";
import { Avatar, Flex } from "antd";
import Link from "antd/es/typography/Link";
import Title from "antd/es/typography/Title";
import { useRouter } from "next/navigation";
import React, { CSSProperties, useEffect, useState } from "react";

interface LayoutHeaderComponentProps {}

const avatarStyle: CSSProperties = {
  backgroundColor: "white",
  color: "black",
  cursor: "pointer",
};

const LayoutHeaderComponent: React.FC<LayoutHeaderComponentProps> = ({}) => {
  const [userUid, setUserUid] = useState<string | null>(null);
  const [accountUid, setAccountUid] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setUserUid(AuthStorage.getUserUid());
    setAccountUid(AuthStorage.getAccountUid());
  }, []);

  const user = useUser({ user_uid: userUid });
  const account = useAccount({ account_uid: accountUid });

  const handleLogout = () => {
    AuthStorage.clear();
    window.location.href = "/login";
  };

  // const popoverContent = (
  //   <Flex vertical gap={8}>
  //     <div>Xin chào, {user?.data?.lastName || "Admin"}</div>
  //     <Button danger onClick={handleLogout}>
  //       Đăng xuất
  //     </Button>
  //   </Flex>
  // );

  return (
    <Flex
      gap={10}
      justify="space-between"
      align="center"
      className="h-full px-4"
    >
      <Link href="/welcom">PHONE SHOP</Link>
      {/* <Popover content={popoverContent} trigger="click" placement="bottomRight">
        <Avatar style={avatarStyle}>{user?.data?.lastName?.[0] || "A"}</Avatar>
      </Popover>
       */}
      <Flex gap={10} align="center">
        {user?.data ? (
          <Title
            level={4}
            style={{
              color: "white",
              margin: 0, // Thêm dòng này để loại bỏ margin mặc định
            }}
          >
            {`${user.data?.firstName} ${user.data?.lastName}`}
          </Title>
        ) : (
          account && (
            <strong
              style={{
                color: "white",
                margin: 0, // Thêm dòng này để loại bỏ margin mặc định
              }}
            >
              {account.data?.username}
            </strong>
          )
        )}

        <Avatar
          style={avatarStyle}
          onClick={() => router.push("/profile")}
          src={user.data?.photoUrl}
        >
          {user?.data?.lastName?.[0] || "A"}
        </Avatar>
      </Flex>
    </Flex>
  );
};

export default LayoutHeaderComponent;
