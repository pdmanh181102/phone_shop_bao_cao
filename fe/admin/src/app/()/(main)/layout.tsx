"use client";

import React, { useEffect, useMemo, useState } from "react";

import { AuthStorage } from "@/uitl/auth_storage";
import { App, Layout, Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { usePathname, useRouter } from "next/navigation";
import { FaBoxOpen, FaShoppingCart, FaTag } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import { MdManageAccounts, MdOutlineInventory } from "react-icons/md";
import LayoutFooterComponent from "./_component/layout_footer_components";
import LayoutHeaderComponent from "./_component/layout_header_component";

interface SiderTemplateProps {}

type MenuItem = Required<MenuProps>["items"][number];

const enum MENU_KEYS {
  ANALYSIS = "1",
  BRAND = "2",
  PRODUCT = "3",
  SUPPLIER = "4",
  ACCOUNT = "5",
  INVENTORY = "6",
  ORDER = "7",
  CUSTOMER = "8",

  // Submenus
  ACCOUNT_USER = "5.1",
  ACCOUNT_ROLE = "5.2",

  INVENTORY_IMPORT = "6.1",
  INVENTORY_EXPORT = "6.2",
  INVENTORY_ADJUST = "6.3",
}

const SiderTemplate: React.FC<SiderTemplateProps> = ({}) => {
  const router = useRouter();
  const pathname = usePathname();

  const [authories, setAuthories] = useState<string[]>([]);

  useEffect(() => {
    setAuthories(AuthStorage.getAuthories());
  }, []);

  const allMenuItems: MenuItem[] = useMemo(
    () => [
      {
        key: MENU_KEYS.ANALYSIS,
        label: "Home",
        onClick: () => router.push("/home"),
        icon: <IoHome />,
      },
      {
        key: MENU_KEYS.BRAND,
        label: "Thương hiệu",
        onClick: () => router.push("/brands"),
        icon: <FaTag />,
      },
      {
        key: MENU_KEYS.PRODUCT,
        label: "Sản phẩm",
        onClick: () => router.push("/products"),
        icon: <FaBoxOpen />,
      },
      {
        key: MENU_KEYS.SUPPLIER,
        label: "Nhà cung cấp",
        onClick: () => router.push("/suppliers"),
        icon: <FaBoxOpen />,
      },
      {
        key: MENU_KEYS.ACCOUNT,
        label: "Tài khoản",
        icon: <MdManageAccounts />,
        children: [
          {
            key: MENU_KEYS.ACCOUNT_USER,
            label: "Người dùng",
            onClick: () => router.push("/users"),
          },
          {
            key: MENU_KEYS.ACCOUNT_ROLE,
            label: "Role",
            onClick: () => router.push("/roles"),
          },
        ],
      },
      {
        key: MENU_KEYS.INVENTORY,
        label: "Kho",
        icon: <MdOutlineInventory />,
        children: [
          {
            key: MENU_KEYS.INVENTORY_IMPORT,
            label: "Nhập kho",
            onClick: () => router.push("/imports"),
          },
          {
            key: MENU_KEYS.INVENTORY_EXPORT,
            label: "Xuất kho",
            onClick: () => router.push("/exports"),
          },
          {
            key: MENU_KEYS.INVENTORY_ADJUST,
            label: "Điều chỉnh tồn kho",
            onClick: () => router.push("/inventory-adjustment"),
          },
        ],
      },
      {
        key: MENU_KEYS.ORDER,
        label: "Đơn hàng",
        onClick: () => router.push("/orders"),
        icon: <FaShoppingCart />,
      },
      {
        key: MENU_KEYS.CUSTOMER,
        label: "Khách hàng",
        onClick: () => router.push("/customers"),
        icon: <FaUser />,
      },
    ],
    []
  );

  const getMenuItems = (menuKey: MENU_KEYS): MenuItem | null => {
    for (const item of allMenuItems) {
      if (item?.key == menuKey) {
        return item;
      }
    }
    return null;
  };

  // Map url -> key
  const selectedKey = useMemo(() => {
    if (pathname.startsWith("/brands")) return MENU_KEYS.BRAND;
    if (pathname.startsWith("/products")) return MENU_KEYS.PRODUCT;
    if (pathname.startsWith("/suppliers")) return MENU_KEYS.SUPPLIER;
    if (pathname.startsWith("/users")) return MENU_KEYS.ACCOUNT_USER;
    if (pathname.startsWith("/roles")) return MENU_KEYS.ACCOUNT_ROLE;
    if (pathname.startsWith("/imports")) return MENU_KEYS.INVENTORY_IMPORT;
    if (pathname.startsWith("/exports")) return MENU_KEYS.INVENTORY_EXPORT;
    if (pathname.startsWith("/inventory-adjustment"))
      return MENU_KEYS.INVENTORY_ADJUST;
    if (pathname.startsWith("/orders")) return MENU_KEYS.ORDER;
    if (pathname.startsWith("/customers")) return MENU_KEYS.CUSTOMER;
    return MENU_KEYS.ANALYSIS; // Default là Home
  }, [pathname]);

  const menuItems: MenuItem[] = useMemo(() => {
    console.log(authories);
    const items: MenuItem[] = [];
    if (authories.includes("READ_ALL_ANALYSIS")) {
      const item = getMenuItems(MENU_KEYS.ANALYSIS);
      if (item) items.push(item);
    }
    if (authories.includes("READ_ALL_BRAND")) {
      const item = getMenuItems(MENU_KEYS.BRAND);
      if (item) items.push(item);
    }
    if (authories.includes("READ_ALL_PRODUCT")) {
      const item = getMenuItems(MENU_KEYS.PRODUCT);
      if (item) items.push(item);
    }
    if (authories.includes("READ_ALL_SUPPLIER")) {
      const item = getMenuItems(MENU_KEYS.SUPPLIER);
      if (item) items.push(item);
    }
    if (authories.includes("READ_ALL_ACCOUNT")) {
      const item = getMenuItems(MENU_KEYS.ACCOUNT);
      if (item) items.push(item);
    }
    if (authories.includes("READ_ALL_INVENTORY")) {
      const item = getMenuItems(MENU_KEYS.INVENTORY);
      if (item) items.push(item);
    }
    if (authories.includes("READ_ALL_ORDER")) {
      const item = getMenuItems(MENU_KEYS.ORDER);
      if (item) items.push(item);
    }
    if (authories.includes("READ_ALL_CUSTOMER")) {
      const item = getMenuItems(MENU_KEYS.CUSTOMER);
      if (item) items.push(item);
    }
    return items;
  }, [router, authories]);

  return (
    <Menu
      mode="inline"
      theme="dark"
      items={menuItems}
      selectedKeys={[selectedKey]}
      defaultOpenKeys={[selectedKey.split(".")[0]]} // để mở rộng menu cha
    />
  );
};

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();

  const [collapsed, setCollapsed] = useState<boolean>(false);
  return (
    <App>
      <Layout style={{ minHeight: "100vh" }}>
        {/* Header nằm trên cùng */}
        <Header>
          <LayoutHeaderComponent />
        </Header>

        {/* Phần thân gồm Sider và Content */}
        <Layout>
          <Sider
            collapsible
            collapsed={collapsed}
            breakpoint="md"
            onCollapse={(value: boolean) => setCollapsed(value)}
          >
            <SiderTemplate />
          </Sider>
          <Layout>
            <Content
              style={{
                padding: "10px",
                backgroundColor: "white",
                minHeight: "100vh",
              }}
            >
              {children}
            </Content>
            <Footer style={{ padding: 0 }}>
              <LayoutFooterComponent />
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    </App>
  );
}
