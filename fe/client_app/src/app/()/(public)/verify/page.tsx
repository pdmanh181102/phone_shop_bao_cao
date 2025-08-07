"use client";

import { CustomerApi } from "@/api/client/customer_api";
import { getMessageApi } from "@/context/MessageContext";
import type { InputRef } from "antd";
import { Button, Col, Input, Row, Typography } from "antd";
import { useRouter } from "next/navigation"; // ✅ đúng cho App Router
import React, { useEffect, useRef, useState } from "react";
const { Title, Text, Link } = Typography;

const VerifyPage: React.FC = () => {
  const router = useRouter();
  const [resendCooldown, setResendCooldown] = useState(0);
  const [email, setEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(InputRef | null)[]>([]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("emailToVerify");
    setEmail(storedEmail);
  }, []);
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleVerify = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      getMessageApi().error("Vui lòng nhập đủ 6 chữ số OTP");
      return;
    }

    if (!email) {
      getMessageApi().error("Không tìm thấy email để xác thực.");
      return;
    }

    setIsVerifying(true);

    try {
      console.log("Gửi xác thực với:", { email, otp: code });

      const res = await CustomerApi.verifyOtp(email, code); // ✅ Gửi OTP và email

      if (res.success) {
        getMessageApi().success(res.message || "Xác thực thành công!");
        localStorage.removeItem("emailToVerify");
        router.push("/login");
      } else {
        getMessageApi().error(res.message || "OTP không đúng hoặc đã hết hạn.");
      }
    } catch (error: any) {
      console.error("Lỗi API verify OTP:", error);

      const errorMsg =
        error?.response?.data?.message || // nếu từ axios
        error?.message ||
        "Xác thực thất bại. Vui lòng thử lại.";

      getMessageApi().error(errorMsg);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.input?.focus(); // ✅ gọi .input
    }

    if (!value && index > 0) {
      inputRefs.current[index - 1]?.input?.focus(); // ✅ gọi .input
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (paste.length === 0) return;

    const newOtp = [...otp];
    for (let i = 0; i < paste.length; i++) {
      newOtp[i] = paste[i];
    }
    setOtp(newOtp);
    const nextIndex = Math.min(paste.length, 5);
    inputRefs.current[nextIndex]?.focus();
    e.preventDefault();
  };

  const handleResend = async () => {
    if (!email) {
      getMessageApi().error("Không tìm thấy email để gửi lại OTP.");
      return;
    }

    try {
      await CustomerApi.resendOtp(email);
      getMessageApi().success("OTP mới đã được gửi đến email của bạn.");
      setResendCooldown(30); // ẩn nút trong 30s
    } catch (error: any) {
      console.error("Lỗi gửi lại OTP:", error);
      const msg = error?.response?.data?.message || "Không thể gửi lại OTP.";
      getMessageApi().error(msg);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.circle}>
          <div style={styles.circleInner}>
            <Text strong style={{ fontSize: 18, color: "#5b9df9" }}>
              OTP
            </Text>
          </div>
        </div>

        <Title level={3}>Xác thực OTP</Title>
        <Text type="secondary">
          Nhập mã gồm 6 chữ số đã gửi đến email của bạn:
        </Text>

        <Row
          gutter={8}
          justify="center"
          style={{
            marginTop: 24,
            marginBottom: 8,
            display: "flex",
            flexWrap: "nowrap", // ngăn xuống dòng
          }}
        >
          {otp.map((digit, index) => (
            <Col key={index}>
              <Input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                id={`otp-${index}`}
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                style={{
                  ...styles.otpInput,
                  width: 40,
                  textAlign: "center",
                }}
                autoFocus={index === 0}
              />
            </Col>
          ))}
        </Row>

        <Text type="secondary">
          {!resendCooldown ? (
            <>
              Không nhận được mã?{" "}
              <Link onClick={handleResend}>Gửi lại OTP</Link>
            </>
          ) : (
            <>
              Vui lòng đợi <Text strong>{resendCooldown}s</Text> để gửi lại mã
            </>
          )}
        </Text>

        <Button
          type="primary"
          size="large"
          block
          onClick={handleVerify}
          loading={isVerifying}
          style={{ marginTop: 24 }}
        >
          Xác nhận OTP
        </Button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to bottom right, #e6f0ff, #d0e0f5)",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 40,
    borderRadius: 20,
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: 400,
    maxWidth: "100%",
  },
  circle: {
    marginBottom: 24,
    width: 100,
    height: 100,
    borderRadius: "50%",
    backgroundColor: "#dce8ff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 24px",
  },
  circleInner: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    backgroundColor: "#e6f0ff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "2px solid #5b9df9",
  },
  otpInput: {
    width: 48,
    height: 48,
    fontSize: 20,
    textAlign: "center",
    border: "1px solid #5b9df9",
    borderRadius: 8,
  },
};

export default VerifyPage;
