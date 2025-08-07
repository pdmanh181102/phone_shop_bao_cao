"use client";
import { useAddCartItem } from "@/api/state/cart/useAddCartItem";
import OrderButtonComponent from "@/component/OrderButtonComponent";
import ProductAvatarComponent from "@/component/product_avatar_component";
import { getMessageApi } from "@/context/MessageContext";
import { AuthStorage } from "@/util/auth_storage";
import { formatCurrencyVND } from "@/util/format_util";
import { CheckCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Flex, Rate } from "antd";
import Link from "antd/es/typography/Link";
import Title from "antd/es/typography/Title";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { FaCartPlus } from "react-icons/fa";

interface ProductCardComponentProps {
  uid: string;
  name: string;
  star: number | null;
  sold: number;
  current: number;
  price: number;
  status: string;
}

const ProductCardComponent: React.FC<ProductCardComponentProps> = ({
  uid,
  name,
  star,
  price,
  sold,
  current,
}) => {
  const router = useRouter();
  const [isCompared, setIsCompared] = useState(false);
  const { add: addToCart, loading } = useAddCartItem();
  const handleToggleCompare = () => {
    const raw = localStorage.getItem("compareProductUids");
    let uids: string[] = raw ? JSON.parse(raw) : [];

    if (uids.includes(uid)) {
      // Remove
      uids = uids.filter((id) => id !== uid);
      setIsCompared(false);
      getMessageApi().success("Đã bỏ so sánh sản phẩm");
    } else {
      // Add
      uids.push(uid);
      setIsCompared(true);
      getMessageApi().success("Đã thêm sản phẩm vào so sánh");
    }

    localStorage.setItem("compareProductUids", JSON.stringify(uids));
    window.dispatchEvent(new Event("compareUpdated")); // 
  };
  const handleAddToCard = () => {
    if (!AuthStorage.isLogined()) router.push("/login");
    addToCart({ customerUid: AuthStorage.getAccountUid()!, productUid: uid });
  };
  useEffect(() => {
    const raw = localStorage.getItem("compareProductUids");
    if (!raw) return;

    const uids: string[] = JSON.parse(raw);
    setIsCompared(uids.includes(uid));
  }, [uid]);

  return (
    <Card
      style={{ width: "100%" }}
      cover={<ProductAvatarComponent productUid={uid} />}
    >
      <Flex vertical gap={10}>
        <Rate defaultValue={star || 5} disabled style={{ fontSize: 14 }} />
        <Link
          href={`/products/${uid}`}
          className="line-clamp-2 block text-blue-500 hover:underline leading-snug min-h-[3rem]"
        >
          {name}
        </Link>
        <Title level={5}>{formatCurrencyVND(price)}</Title>
        <Descriptions
          size="small"
          column={1}
          items={[
            { label: "Đã bán", children: sold },
            { label: "Hiện có", children: current },
          ]}
        />
        <Flex justify="space-between" wrap gap={10}>
          <Button
            icon={isCompared ? <CheckCircleOutlined /> : <PlusCircleOutlined />}
            onClick={handleToggleCompare}
            size="small"
            style={{
              backgroundColor: isCompared ? "#1677ff" : "#fff",
              color: isCompared ? "#fff" : "#1677ff",
              borderColor: "#1677ff",
            }}
          >
            So sánh
          </Button>

          <Button
            variant="outlined"
            color="orange"
            icon={<FaCartPlus />}
            onClick={handleAddToCard}
            loading={loading}
            size="small"
          >
            Thêm
          </Button>
          <OrderButtonComponent productUid={uid} />
        </Flex>
      </Flex>
    </Card>
  );
};

export default ProductCardComponent;
