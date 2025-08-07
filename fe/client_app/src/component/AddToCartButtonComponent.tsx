"use client";

import { CartItemApi } from "@/api/client/cart_item_api";
import { useCart } from "@/context/CartContext"; // ✅ Thêm dòng này
import { getMessageApi } from "@/context/MessageContext";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  productUid: string;
}

const AddToCartButtonComponent: React.FC<Props> = ({ productUid }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const message = getMessageApi();
  const { refreshCart } = useCart(); // ✅ Lấy hàm cập nhật giỏ

  const handleAddToCart = async () => {
    const accountUid = localStorage.getItem("account_uid");
    if (!accountUid) {
      message.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      router.push(
        `/login?redirectTo=${encodeURIComponent(`/products/${productUid}`)}`
      );
      return;
    }

    try {
      setLoading(true);
      await CartItemApi.create(productUid, 1);
      await refreshCart(); // ✅ Cập nhật lại số lượng giỏ hàng
      message.success("Đã thêm vào giỏ hàng");
    } catch (error) {
      message.error("Thêm vào giỏ thất bại, vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleAddToCart} loading={loading}>
      Thêm vào giỏ
    </Button>
  );
};

export default AddToCartButtonComponent;
