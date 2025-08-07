"use client";

import { useCustomer } from "@/api/state/customer/useCustomer";
import { AuthStorage } from "@/util/auth_storage";
import { Avatar, Button, Flex } from "antd";
import Link from "antd/es/typography/Link";
import Title from "antd/es/typography/Title";
import { useRouter } from "next/navigation";
import React, { CSSProperties, useEffect, useState } from "react";
import { FaClipboardList, FaShoppingCart } from "react-icons/fa";

const avatarStyle: CSSProperties = {
  backgroundColor: "black",
  color: "white",
  cursor: "pointer",
};

interface LayoutHeaderProps {}

const LayoutHeader: React.FC<LayoutHeaderProps> = ({}) => {
  const router = useRouter();
  const [accountUid, setAccountUid] = useState<string | null>(null);

  // Chỉ lấy từ localStorage sau khi đã render phía client
  useEffect(() => {
    const uid = AuthStorage.getAccountUid();
    setAccountUid(uid);
  }, []);

  const { data: account, isLoading } = useCustomer(accountUid!);

  return (
    <>
      <Flex
        gap={10}
        justify="space-between"
        style={{ height: 50, padding: "20px" }}
        align="center"
      >
        <Title>
          <Link href="/">PhoneShop</Link>
        </Title>
        {account && AuthStorage.isLogined() ? (
          <Flex gap={30} wrap>
            <Button
              type="text"
              shape="circle"
              icon={<FaClipboardList />}
              onClick={() => router.push("/orders")}
            />
            <Button
              type="text"
              shape="circle"
              icon={<FaShoppingCart />}
              onClick={() => router.push("/carts")}
            />
            <Avatar style={avatarStyle} onClick={() => router.push("/users")}>
              {account?.firstName}
            </Avatar>
          </Flex>
        ) : (
          <Flex gap={10}>
            <Button
              size="small"
              variant="outlined"
              color="blue"
              type="link"
              href="/register"
            >
              Đăng ký
            </Button>
            <Button
              size="small"
              variant="solid"
              color="blue"
              type="link"
              href="/login"
            >
              Đăng nhập
            </Button>
          </Flex>
        )}
      </Flex>
    </>
  );
};

export default LayoutHeader;
