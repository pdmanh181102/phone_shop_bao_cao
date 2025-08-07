"use client";

import { useCartItemsMutate } from "@/api/state/cart/useCartItemsMutate";
import { useRemoveCartItem } from "@/api/state/cart/useRemoveCartItem";
import { Product } from "@/api/type/product";
import { getMessageApi } from "@/context/MessageContext";
import { AuthStorage } from "@/util/auth_storage";
import { formatCurrencyVND } from "@/util/format_util";
import { CheckOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Empty,
  Flex,
  Rate,
  Row,
  Typography,
} from "antd";
import Link from "antd/es/typography/Link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CartItemAvatarComponent from "./_component/cart_item_avatar";

const { Title, Text } = Typography;

const CartPage: React.FC = () => {
  const router = useRouter();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchCartItems(AuthStorage.getAccountUid()!);
  }, []);

  const { fetch: fetchCartItems, loading } = useCartItemsMutate((items) =>
    setProducts(items)
  );
  const { remove: removeCartItem } = useRemoveCartItem(() =>
    fetchCartItems(AuthStorage.getAccountUid()!)
  );

  const handleToggle = (uid: string, checked: boolean) => {
    setSelectedItems((prev) =>
      checked ? [...prev, uid] : prev.filter((id) => id !== uid)
    );
  };

  const handleOrderOLD = () => {
    if (selectedItems.length === 0) return;

    const query = selectedItems.join(",");
    router.push(`/orders/create?id=${query}`);
  };

  const handleOrder = () => {
    if (selectedItems.length === 0) return;
    const query = selectedItems.join(",");

    if (selectedItems.length === 0) {
      getMessageApi().warning("Vui lòng chọn sản phẩm để đặt hàng");
      return;
    }

    // Lưu thông tin tạm thời
    localStorage.setItem("order_items", query);
    window.location.href = "/orders/creates";
  };

  return (
    <Row justify={"center"}>
      <Col md={{ span: 24 }} lg={{ span: 12 }}>
        <main>
          <Flex vertical gap={20}>
            <Title level={3} className="text-blue-600">
              Giỏ hàng của bạn
            </Title>

            {loading ? (
              <Text>Đang tải giỏ hàng...</Text>
            ) : products.length === 0 ? (
              <Empty description="Giỏ hàng trống" />
            ) : (
              products.map((item) => {
                const isSelectable =
                  item.currentQuantity > 0 && item.status === "Hiển thị";

                return (
                  <Card
                    key={item.uid}
                    className="border rounded-lg hover:shadow-md transition"
                  >
                    <Row align="middle" gutter={16}>
                      <Col>
                        <Checkbox
                          checked={selectedItems.includes(item.uid)}
                          disabled={!isSelectable}
                          onChange={(e) =>
                            handleToggle(item.uid, e.target.checked)
                          }
                        />
                      </Col>
                      <Col>
                        <CartItemAvatarComponent productUid={item.uid} />
                      </Col>
                      <Col flex="auto">
                        <div className="space-y-1">
                          <Text strong>
                            <Link href={`/products/${item.uid}`}>
                              {item.name}
                            </Link>
                          </Text>
                          <br />
                          <Rate
                            style={{ fontSize: "1rem" }}
                            disabled
                            allowHalf
                            value={item.star || 5}
                          />
                          <br />
                          <Text type="secondary">
                            Giá: {formatCurrencyVND(item.price)}
                          </Text>
                          <br />
                          <Text>Số lượng còn: {item.currentQuantity}</Text>
                          <br />
                          <Text>Status: {item.status}</Text>
                        </div>
                      </Col>
                      <Col>
                        <Button
                          size="small"
                          variant="solid"
                          color="danger"
                          onClick={() =>
                            removeCartItem({
                              customerUid: AuthStorage.getAccountUid()!,
                              productUid: item.uid,
                            })
                          }
                        >
                          Xóa
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                );
              })
            )}

            {products.length > 0 && (
              <div className="flex justify-end pt-4">
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  disabled={selectedItems.length === 0}
                  onClick={handleOrder}
                >
                  Đặt hàng ({selectedItems.length})
                </Button>
              </div>
            )}
          </Flex>
        </main>
      </Col>
    </Row>
  );
};

export default CartPage;
