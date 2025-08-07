"use client";

import { useAddCartItem } from "@/api/state/cart/useAddCartItem";
import { Product } from "@/api/type/product";
import { getMessageApi } from "@/context/MessageContext";
import { AuthStorage } from "@/util/auth_storage";
import { formatCurrencyVND } from "@/util/format_util";
import { Button, Descriptions, Flex, Rate, Tag, Tooltip } from "antd";
import Text from "antd/es/typography/Text";
import Title from "antd/es/typography/Title";
import { useRouter } from "next/navigation";
import React from "react";
import { FaBolt, FaShoppingCart } from "react-icons/fa";

interface ProductInfoComponentProps {
  product: Product;
}

const ProductInfoComponent: React.FC<ProductInfoComponentProps> = ({
  product,
}) => {
  const availableQuantity = product.currentQuantity;

  const hasValidPrice = product.price && product.price > 0;

  const router = useRouter();

  const { add: addToCart, loading } = useAddCartItem();

  const handleAddToCard = () => {
    if (!AuthStorage.isLogined()) router.push("/login");
    addToCart({
      customerUid: AuthStorage.getAccountUid()!,
      productUid: product.uid,
    });
  };

  const handleBuyNow = () => {
    const accountUid = AuthStorage.getAccountUid();

    if (!accountUid) {
      getMessageApi().warning("Vui lòng đăng nhập để mua hàng.");

      router.push(
        `/login?redirectTo=${encodeURIComponent(`/products/${product.uid}`)}`
      );
      return;
    }

    localStorage.setItem("order_items", product.uid);
    window.location.href = "/orders/creates";
  };

  return (
    <Flex vertical gap={16} className="w-full">
      {/* Tên sản phẩm */}
      <Title level={3} className="!mb-0 !text-gray-800">
        {product.name}
      </Title>

      {/* Giá và đánh giá */}
      <Flex vertical wrap="wrap" gap={10}>
        {hasValidPrice ? (
          <Text strong className="text-lg text-red-600">
            {formatCurrencyVND(product.price)}
          </Text>
        ) : (
          <Text type="secondary" italic>
            Giá chưa được cập nhật
          </Text>
        )}
        <Rate disabled allowHalf value={product.star || 5} />
      </Flex>

      {/* Mô tả thuộc tính */}
      <Descriptions
        column={1}
        size="small"
        styles={{
          label: { fontWeight: "500", width: 150, color: "#666" },
          content: { color: "#222" },
        }}
      >
        <Descriptions.Item label="Tình trạng">
          {availableQuantity > 0 ? (
            <Tag color="green">Còn hàng</Tag>
          ) : (
            <Tag color="red">Hết hàng</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Số lượng còn lại">
          {availableQuantity}
        </Descriptions.Item>
        <Descriptions.Item label="Đã bán">
          {product.soldQuantity}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={product.status.includes("Hiển") ? "blue" : "default"}>
            {product.status}
          </Tag>
        </Descriptions.Item>
      </Descriptions>

      {/* Hành động */}
      {product.status === "Hiển thị" && (
        <Flex gap={10} wrap="wrap">
          <Tooltip
            title={!hasValidPrice ? "Sản phẩm chưa có giá" : ""}
            placement="top"
          >
            <Button
              icon={<FaBolt />}
              disabled={!hasValidPrice || availableQuantity <= 0}
              className="bg-red-600 hover:bg-red-700 text-white"
              variant="solid"
              color="danger"
              onClick={handleBuyNow}
            >
              Mua ngay
            </Button>
          </Tooltip>
          <Tooltip
            title={!hasValidPrice ? "Sản phẩm chưa có giá" : ""}
            placement="top"
          >
            <Button
              icon={<FaShoppingCart />}
              disabled={!hasValidPrice || availableQuantity <= 0}
              className="border-gray-400 text-gray-700 hover:border-gray-600 hover:text-black"
              variant="outlined"
              color="orange"
              onClick={handleAddToCard}
            >
              Thêm vào giỏ hàng
            </Button>
          </Tooltip>
        </Flex>
      )}
    </Flex>
  );
};

export default ProductInfoComponent;
