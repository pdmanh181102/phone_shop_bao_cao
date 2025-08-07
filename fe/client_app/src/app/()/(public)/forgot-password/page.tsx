"use client";

import { CustomerApi } from "@/api/client/customer_api";
import { getMessageApi } from "@/context/MessageContext";
import {
  CheckCircleOutlined,
  LockOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Flex, Form, Input, Steps, Typography } from "antd";
import { AnimatePresence, motion } from "framer-motion"; // ✅ import thêm
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const { Title } = Typography;

const ForgotPasswordPage: React.FC = () => {
  const router = useRouter();
  const [resendCountdown, setResendCountdown] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);

  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [loadingStep, setLoadingStep] = useState(false);

  const next = () => {
    setDirection("forward");
    setCurrentStep((prev) => prev + 1);
  };

  const prev = () => {
    setDirection("backward");
    setCurrentStep((prev) => prev - 1);
  };

  const handleResendOtp = async () => {
    if (!email) {
      getMessageApi().error(
        "Không tìm thấy email. Vui lòng quay lại bước trước."
      );
      return;
    }

    setLoadingStep(true);
    try {
      await CustomerApi.resendOtp(email);
      getMessageApi().success("Mã xác thực đã được gửi lại.");

      // Bắt đầu đếm ngược
      setResendDisabled(true);
      setResendCountdown(30);
      const interval = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      getMessageApi().error("Gửi lại mã xác thực thất bại. Vui lòng thử lại.");
    } finally {
      setLoadingStep(false);
    }
  };

  const handleSubmitStep1 = () => {
    form.validateFields(["email"]).then(async (values) => {
      setLoadingStep(true);
      const email = values.email;
      setEmail(email);

      try {
        const exists = await CustomerApi.checkEmailExists(email);
        if (exists) {
          // Gửi mã OTP
          await CustomerApi.resendOtp(email);
          getMessageApi().success(
            "Mã xác thực đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư đến."
          );

          next();
          setLoadingStep(false);
          return;
        }

        getMessageApi().error(
          "Email chưa tồn tại trong hệ thống. Vui lòng kiểm tra lại email."
        );
        setLoadingStep(false);
      } catch (error) {
        getMessageApi().error(
          "Đã xảy ra lỗi khi gửi mã xác thực. Vui lòng thử lại."
        );
        setLoadingStep(false);
      }
    });
  };

  const handleSubmitStep2 = () => {
    form.validateFields(["otp"]).then(async (values) => {
      const otpValue = values.otp?.trim();

      // Kiểm tra có đúng 6 chữ số không
      const isValidOtp = /^\d{6}$/.test(otpValue);
      if (!isValidOtp) {
        getMessageApi().error(
          "Mã OTP không hợp lệ. Vui lòng nhập đúng 6 chữ số."
        );
        return;
      }

      setLoadingStep(true);
      try {
        const res = await CustomerApi.verifyOtp(email, otpValue);
        if (res.success) {
          getMessageApi().success("Xác thực thành công.");
          setOtp(otpValue);
          next(); // Chuyển sang bước 3
        } else {
          getMessageApi().error(res.message || "Xác thực thất bại.");
        }
      } catch (err: any) {
        getMessageApi().error(err.message || "Lỗi khi xác thực OTP.");
      } finally {
        setLoadingStep(false);
      }
    });
  };

  const handleSubmitStep3 = () => {
    form
      .validateFields(["newPassword", "confirmPassword"])
      .then(async (values) => {
        const { newPassword, confirmPassword } = values;

        // Kiểm tra xác nhận khớp nhau đã được xử lý ở rules,
        // tại đây chỉ cần kiểm tra độ dài mật khẩu
        if (newPassword.length < 6) {
          getMessageApi().error("Mật khẩu phải có ít nhất 6 ký tự.");
          return;
        }

        setLoadingStep(true);
        try {
          const res = await CustomerApi.updatePasswordByEmail(
            email,
            newPassword
          );
          if (res.success) {
            getMessageApi().success(res.message || "Đổi mật khẩu thành công.");
            setTimeout(() => {
              router.push("/login"); // 🔄 chuyển hướng sau 1.5s
            }, 1500);
          } else {
            getMessageApi().error(res.message || "Đổi mật khẩu thất bại.");
          }
        } catch (error: any) {
          getMessageApi().error(error.message || "Lỗi khi đổi mật khẩu.");
        } finally {
          setLoadingStep(false);
        }
      })
      .catch((errorInfo) => {
        // Trong trường hợp người dùng chưa nhập gì mà ấn submit
        console.log("Validate Failed:", errorInfo);
      });
  };

  const steps = [
    {
      title: "Thông tin tài khoản",
      icon: <UserOutlined />,
      content: (
        <>
          <Form.Item
            name="email"
            label="Email khôi phục"
            rules={[{ required: true, message: "Vui lòng nhập email" }]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSubmitStep1}
              loading={loadingStep}
              block
            >
              Gửi mã xác thực
            </Button>
          </Form.Item>
        </>
      ),
    },
    {
      title: "Xác thực OTP",
      icon: <SafetyCertificateOutlined />,
      content: (
        <>
          <Form.Item
            name="otp"
            label={
              <Flex justify="space-between" align="center">
                <span>Mã xác thực OTP</span>
                <Button
                  type="link"
                  onClick={handleResendOtp}
                  disabled={resendDisabled}
                  style={{ padding: 0, height: "auto" }}
                >
                  {resendDisabled
                    ? `Gửi lại sau ${resendCountdown}s`
                    : "Gửi lại"}
                </Button>
              </Flex>
            }
            rules={[{ required: true, message: "Vui lòng nhập mã OTP" }]}
          >
            <Input prefix={<SafetyCertificateOutlined />} />
          </Form.Item>

          <Form.Item>
            <Flex justify="space-between">
              <Button onClick={prev}>Quay lại</Button>
              <Button
                type="primary"
                onClick={handleSubmitStep2}
                loading={loadingStep}
              >
                Xác thực
              </Button>
            </Flex>
          </Form.Item>
        </>
      ),
    },

    {
      title: "Mật khẩu mới",
      icon: <LockOutlined />,
      content: (
        <>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Mật khẩu xác nhận không khớp");
                },
              }),
            ]}
          >
            <Input.Password prefix={<CheckCircleOutlined />} />
          </Form.Item>
          <Form.Item>
            <Flex justify="space-between">
              <Button onClick={prev}>Quay lại</Button>
              <Button
                type="primary"
                onClick={handleSubmitStep3}
                loading={loadingStep}
              >
                Xác nhận đổi mật khẩu
              </Button>
            </Flex>
          </Form.Item>
        </>
      ),
    },
  ];

  // animation object
  const variants = {
    enter: (direction: "forward" | "backward") => ({
      x: direction === "forward" ? 300 : -300,
      opacity: 0,
      position: "absolute",
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative",
    },
    exit: (direction: "forward" | "backward") => ({
      x: direction === "forward" ? -300 : 300,
      opacity: 0,
      position: "absolute",
    }),
  };

  return (
    <Flex
      justify="center"
      align="flex-start"
      style={{ minHeight: "100vh", paddingTop: "100px" }}
    >
      <Card
        style={{
          width: 600,
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <Title
          level={3}
          style={{ textAlign: "center", marginBottom: 32, color: "#1890ff" }}
        >
          Quên mật khẩu
        </Title>
        <Steps
          current={currentStep}
          size="small"
          style={{ marginBottom: 32 }}
          items={steps.map((step) => ({
            title: step.title,
            icon: step.icon,
          }))}
        />
        <Form form={form} layout="vertical">
          <div style={{ position: "relative", minHeight: 220 }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
                style={{
                  position: "absolute",
                  width: "100%",
                }}
              >
                {steps[currentStep].content}
              </motion.div>
            </AnimatePresence>
          </div>
        </Form>
      </Card>
    </Flex>
  );
};

export default ForgotPasswordPage;
