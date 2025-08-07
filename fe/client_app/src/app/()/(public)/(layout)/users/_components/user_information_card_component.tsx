"use client";
import { CustomerApi } from "@/api/client/customer_api";
import { ImageApi } from "@/api/client/image_api";
import { Customer } from "@/api/type/customer";
import FileButton from "@/component/file_button";
import { getMessageApi } from "@/context/MessageContext";
import {
  HomeOutlined,
  IdcardOutlined,
  MailOutlined,
  ManOutlined,
  PhoneOutlined,
  SaveOutlined,
  UploadOutlined,
  UserOutlined,
  WomanOutlined,
} from "@ant-design/icons";

import { useMutation } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
const { Option } = Select;
const { Title, Text } = Typography;
interface UserInformationCardProps {
  userInfo?: Customer | null;
}

const UserInformationCard: React.FC<UserInformationCardProps> = ({
  userInfo,
}) => {
  const [form] = Form.useForm();
  const [photoUrl, setPhotoUrl] = useState<string>(userInfo?.photoUrl || "");
  const [isTouched, setIsTouched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [genderList, setGenderList] = useState<string | null>(null);
  const create_image_mutation = useMutation({
    mutationFn: (file: File) => ImageApi.uploadImage(file),
    onSuccess: (result) => {
      const { url } = result;
      update_photo_url_mutation.mutate(url);
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "Có lỗi xảy ra khi tải ảnh lên");
    },
  });
  const update_photo_url_mutation = useMutation({
    mutationFn: (url: string) =>
      CustomerApi.updatePhotoUrl(userInfo?.uid || "", url),
    onSuccess: (result) => {
      getMessageApi().info("Đã thêm");
      if (result.photoUrl) setPhotoUrl(result.photoUrl);
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "Có lỗi xảy ra khi tải ảnh lên");
    },
  });
  useEffect(() => {
    console.log("UserInformationCard mounted", userInfo, userInfo);
    if (userInfo && userInfo) {
      form.setFieldsValue({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        gender: userInfo.gender, // ví dụ: "male" hoặc "female"
        email: userInfo.email,
        phoneNumber: userInfo.phoneNumber,
        address: userInfo.address,
      });
      setPhotoUrl(userInfo.photoUrl || "");
      setLoading(false);
    }
  }, [userInfo, userInfo, form]);
  if (loading || !userInfo || !userInfo) {
    return <div></div>;
  }

  const onFinish = (values: any) => {
    // Xử lý lưu thông tin người dùng
    CustomerApi.updateFirstName(userInfo.uid, values.firstName);
    CustomerApi.updateLastName(userInfo.uid, values.lastName);
    CustomerApi.updateGender(userInfo.uid, values.gender);
    CustomerApi.updatePhoneNumber(userInfo.uid, values.phoneNumber);
    CustomerApi.updateAddress(userInfo.uid, values.address);
    getMessageApi().success("Lưu thông tin thành công");
    setIsTouched(false); // ✅ Reset lại sau khi submit
  };
  return (
    <>
      {/* First Card */}
      <Col xs={24} sm={12} md={12} lg={12} xl={12}>
        <Card
          style={{
            maxWidth: 1000,
            margin: 20,
            marginTop: 40,
            marginLeft: 100,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
          styles={{ body: { padding: 32 } }}
        >
          <Title level={4} style={{ marginBottom: 24, textAlign: "center" }}>
            Thông tin tài khoản
          </Title>
          <Row gutter={24} justify="center">
            {/* Avatar + Info */}
            <Col span={24}>
              <Space size="middle" align="center" style={{ marginBottom: 32 }}>
                <Avatar size={64} src={photoUrl} alt="User Avatar" />
                <div>
                  <Title level={5} style={{ margin: 0 }}>
                    {userInfo?.firstName} {userInfo?.lastName}
                  </Title>
                  <Text type="secondary">{userInfo.username}</Text>
                </div>
                <FileButton
                  type="primary"
                  icon={<UploadOutlined />}
                  style={{
                    marginLeft: "auto",
                    backgroundColor: "#e6f7ff",
                    borderColor: "#91d5ff",
                    color: "#096dd9",
                  }}
                  onSelectFile={(file: File) =>
                    create_image_mutation.mutate(file)
                  }
                >
                  Cập nhật ảnh
                </FileButton>
              </Space>
            </Col>

            {/* Form */}
            <Col span={24}>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onValuesChange={() => {
                  setIsTouched(true);
                }}
              >
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      label="Tên"
                      name="firstName"
                      rules={[{ required: true }]}
                    >
                      <Input
                        prefix={<IdcardOutlined />}
                        placeholder="Tên của bạn"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Họ"
                      name="lastName"
                      rules={[{ required: true }]}
                    >
                      <Input
                        prefix={<IdcardOutlined />}
                        placeholder="Họ của bạn"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Giới tính"
                      name="gender"
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="Chọn giới tính">
                        <Option value="MALE">
                          <ManOutlined style={{ marginRight: 8 }} />
                          Trai
                        </Option>
                        <Option value="FE_MALE">
                          <WomanOutlined style={{ marginRight: 8 }} />
                          Gái
                        </Option>
                        <Option value="OTHER">
                          <UserOutlined style={{ marginRight: 8 }} />
                          Bê đê
                        </Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[{ required: true }]}
                    >
                      <Input
                        prefix={<MailOutlined />}
                        placeholder="Email của bạn"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label="Địa chỉ"
                      name="address"
                      rules={[{ required: true }]}
                    >
                      <Input
                        prefix={<HomeOutlined />}
                        placeholder="Địa chỉ của bạn"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Số điện thoại"
                      name="phoneNumber"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số điện thoại",
                        },
                        {
                          pattern: /^[0-9]{10,11}$/,
                          message: "Số điện thoại không hợp lệ",
                        },
                      ]}
                    >
                      <Input
                        prefix={<PhoneOutlined />}
                        placeholder="Số điện thoại của bạn"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        disabled={!isTouched}
                        style={
                          isTouched
                            ? {
                                backgroundColor: "#52c41a",
                                borderColor: "#389e0d",
                                color: "#fff",
                              }
                            : {}
                        }
                      >
                        Lưu thay đổi
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Card>
      </Col>
    </>
  );
};

export default UserInformationCard;
