"use client";
import { CustomerApi } from "@/api/client/customer_api";
import { Customer } from "@/api/type/customer";
import { getMessageApi } from "@/context/MessageContext";
import { AuthStorage } from "@/util/auth_storage";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  LogoutOutlined,
  ReloadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const { Option } = Select;
const { Title, Text } = Typography;

interface AccountInformationCardProps {
  accountInfo?: Customer | null;
}

const AccountInformationCard: React.FC<AccountInformationCardProps> = ({
  accountInfo,
}) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const onFinish = async (values: any) => {
    // Handle password change logic here
    const accountUid = accountInfo?.uid;
    if (!accountUid) {
      getMessageApi().error("Không tìm thấy tài khoản");
      return;
    }
    const account = await CustomerApi.changePassword(
      accountUid,
      values.currentPassword,
      values.newPassword
    );
    if (!account) {
      getMessageApi().error("Đổi mật khẩu không thành công");
      return;
    }
    form.resetFields(); // ✅ reset các trường input
    getMessageApi().success("Đổi mật khẩu thành công");
    setShowPasswordForm(false); // Hide the form after successful submission
  };

  return (
    <>
      {/* Second Card */}
      <Col xs={24} sm={12} md={12} lg={12} xl={12}>
        <Card
          style={{
            maxWidth: 600,
            margin: 20,
            marginTop: 40,
            marginLeft: 50,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
          styles={{ body: { padding: 32 } }}
        >
          <Col span={24}>
            <Title level={4} style={{ marginBottom: 24, textAlign: "center" }}>
              Bảo mật và đăng nhập
            </Title>
          </Col>
          <Col span={24}>
            <Row gutter={24}>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong style={{ display: "block", marginBottom: 8 }}>
                    Tài khoản
                  </Text>
                  <Input
                    value={accountInfo?.username}
                    prefix={<UserOutlined />}
                    placeholder="username"
                    disabled
                  />
                </div>
              </Col>
              <Col span={12}></Col>

              <Button
                type="primary"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                icon={
                  showPasswordForm ? <EyeInvisibleOutlined /> : <EyeOutlined />
                }
                style={{
                  backgroundColor: "#e6f7ff",
                  borderColor: "#91d5ff",
                  color: "#096dd9",
                  marginBottom: 16,
                }}
              >
                {showPasswordForm ? "Ẩn form" : "Đổi mật khẩu"}
              </Button>
              <Col span={12}></Col>

              {showPasswordForm && (
                <Form
                  form={form}
                  style={{
                    margin: 20,
                  }}
                  layout="vertical"
                  onFinish={onFinish}
                >
                  <Form.Item
                    label="Mật khẩu hiện tại"
                    name="currentPassword"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mật khẩu hiện tại",
                      },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Mật khẩu mới"
                    name="newPassword"
                    rules={[
                      { required: true, message: "Vui lòng nhập mật khẩu mới" },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Nhập mật khẩu mới"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Nhập lại mật khẩu mới"
                    name="confirmPassword"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập lại mật khẩu mới",
                      },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      icon={<ReloadOutlined />}
                      htmlType="submit"
                      style={{
                        backgroundColor: "#52c41a",
                        borderColor: "#389e0d",
                        color: "#fff",
                      }}
                    >
                      Cập nhật mật khẩu
                    </Button>
                  </Form.Item>
                </Form>
              )}
            </Row>
          </Col>
          <Col>
            <Flex justify="end">
              <Popconfirm
                title="Bạn có chắc muốn đăng xuất?"
                description="Phiên làm việc của bạn sẽ kết thúc."
                onConfirm={() => {
                  AuthStorage.clear();
                  router.push("/");
                }}
                okText="Đăng xuất"
                cancelText="Hủy"
              >
                <Button danger icon={<LogoutOutlined />}>
                  Đăng xuất
                </Button>
              </Popconfirm>
            </Flex>
          </Col>
        </Card>
      </Col>
    </>
  );
};

export default AccountInformationCard;
