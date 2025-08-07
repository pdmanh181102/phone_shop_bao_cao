"use client";

import { useCreatePaymentOrder } from "@/api/state/payment/useCreatePaymentOrder";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, Result, Space, Typography } from "antd";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const { Paragraph, Text } = Typography;

const PaymentRedirectPage = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const orderUid = params.orderUid as string;
  const status = searchParams.get("status");
  const [countdown, setCountdown] = useState(10);

  const { create: createPaymentOrder, loading: createPaymentLoading } =
    useCreatePaymentOrder(() => router.push(`/orders/${orderUid}`));

  useEffect(() => {
    if (status === "1") {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            createPaymentOrder(orderUid);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status, orderUid]);

  const handleBackNow = () => {
    createPaymentOrder(orderUid);
  };

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Result
        status={status === "1" ? "success" : "error"}
        title={
          status === "1" ? "Thanh toán thành công!" : "Thanh toán thất bại"
        }
        subTitle={
          <Space direction="vertical">
            <Paragraph>
              <Text strong>Mã đơn hàng:</Text> {orderUid}
            </Paragraph>
            {status === "1" ? (
              <Paragraph>
                Tự động trở về trang đơn hàng sau{" "}
                <Text strong>{countdown}</Text> giây...
              </Paragraph>
            ) : (
              <Paragraph>Vui lòng thử lại hoặc liên hệ hỗ trợ.</Paragraph>
            )}
          </Space>
        }
        icon={
          status === "1" ? (
            <CheckCircleOutlined style={{ color: "#52c41a" }} />
          ) : (
            <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
          )
        }
        extra={
          <Button
            type="primary"
            onClick={handleBackNow}
            loading={createPaymentLoading}
          >
            Quay về đơn hàng ngay
          </Button>
        }
      />
    </main>
  );
};

export default PaymentRedirectPage;
