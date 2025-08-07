"use client";

import { getMessageApi } from "@/context/MessageContext";
import { AuthStorage } from "@/util/auth_storage";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { FaBolt } from "react-icons/fa";

interface Props {
  productUid: string;
}

const BigOrderButtonComponent: React.FC<Props> = ({ productUid }) => {
  const router = useRouter();
  const message = getMessageApi();

  const handleOrder = () => {
    const accountUid = AuthStorage.getAccountUid();

    if (!accountUid) {
      message.warning("Vui lòng đăng nhập để mua hàng.");

      router.push(
        `/login?redirectTo=${encodeURIComponent(`/products/${productUid}`)}`
      );
      return;
    }

    localStorage.setItem("order_items", productUid);
    window.location.href = "/orders/creates";
  };

  return (
    <Button
      size="small"
      icon={<FaBolt />}
      className="bg-red-600 hover:bg-red-700 text-white"
      variant="solid"
      color="danger"
      onClick={handleOrder}
      style={{ height: '40px', marginBottom: 8, width: '90%', fontSize: '20px' }}
    >
      Mua ngay
    </Button>
  );
};

export default BigOrderButtonComponent;
