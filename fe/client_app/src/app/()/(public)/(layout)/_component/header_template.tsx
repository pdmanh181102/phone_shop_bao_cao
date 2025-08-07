"use client";

import { useCart } from "@/context/CartContext";
import { AuthStorage } from "@/util/auth_storage";
import {
  LoginOutlined,
  LogoutOutlined,
  MobileOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Badge, Button, Flex, Space, Typography } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const { Text } = Typography;

const TemplateHeader: React.FC = () => {
  const router = useRouter();
  const { cartCount } = useCart(); // ✅ Dùng từ context
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(AuthStorage.isLogined());
  }, []);

  const handleLogout = () => {
    AuthStorage.clear();
    router.push("/");
  };

  return (
    <Flex
      style={{
        padding: "10px 24px",
        background: "#fff",
        borderBottom: "1px solid #eee",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
      justify="space-between"
      align="center"
    >
      <Button
        type="link"
        href="/products"
        icon={<MobileOutlined />}
        style={{ fontWeight: 600 }}
      >
        PHONE SHOP
      </Button>

      <Space>
        {isLoggedIn ? (
          <>
            <Button
              icon={
                <Badge count={cartCount} size="small" offset={[4, -4]}>
                  <ShoppingCartOutlined style={{ fontSize: 16 }} />
                </Badge>
              }
              onClick={() => router.push("/carts")}
            >
              Giỏ hàng
            </Button>

            <Button
              icon={<UnorderedListOutlined />}
              onClick={() => router.push("/orders")}
            >
              Đơn hàng
            </Button>

            <Button
              icon={<UserOutlined />}
              onClick={() => router.push("/users")}
            >
              Thông tin
            </Button>

            <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
              Đăng xuất
            </Button>
          </>
        ) : (
          <>
            <Button
              icon={<UserAddOutlined />}
              onClick={() => router.push("/register")}
            >
              Đăng ký
            </Button>
            <Button
              type="primary"
              icon={<LoginOutlined />}
              onClick={() => router.push("/login")}
            >
              Đăng nhập
            </Button>
            {/* <Button
                            type="primary"
                            icon={<LoginOutlined />}
                            onClick={() => router.push('/login')}
                        >
                            Đăng nhập
                        </Button> */}
          </>
        )}
      </Space>
    </Flex>
  );
};

export default TemplateHeader;
