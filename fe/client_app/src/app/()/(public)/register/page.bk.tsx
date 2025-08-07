"use client";

import { useCheckUsername } from "@/api/state/customer/useCheckUsername";
import { useRegister } from "@/api/state/customer/useRegister";
import { useGenderList } from "@/api/state/gender/useGenderList";
import { getMessageApi } from "@/context/MessageContext";
import {
  HomeOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, DatePicker, Form, Input, Row, Select } from "antd";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function RegisterPage() {
  const { checkName, loading } = useCheckUsername(() => {});

  const [form] = Form.useForm();
  const router = useRouter();

  const { data: genders } = useGenderList();

  const genderOptions = useMemo(() => {
    if (!genders) return [];
    return genders.map((gender) => ({
      label: gender.label,
      value: gender.uid,
    }));
  }, [genders]);

  const { mutate: register, isPending } = useRegister(
    () => {
      getMessageApi().success("Đăng ký thành công!");
      router.push("/login");
    },
    (errMsg) => {
      getMessageApi().error(errMsg);
    }
  );

  const onFinish = (values: any) => {
    const payload = {
      ...values,
      birthDay: values.birthDay?.format("YYYY-MM-DD"),
    };
    register(payload);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card
        title="Đăng ký tài khoản"
        className="w-full max-w-xl shadow-lg rounded-2xl"
        styles={{
          header: { textAlign: "center", fontSize: 20 },
        }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="firstName"
                label="Họ"
                rules={[{ required: true, message: "Vui lòng nhập họ" }]}
              >
                <Input placeholder="Họ" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="lastName"
                label="Tên"
                rules={[{ required: true, message: "Vui lòng nhập tên" }]}
              >
                <Input placeholder="Tên" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="gender"
                label="Giới tính"
                rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
              >
                <Select placeholder="Chọn giới tính" options={genderOptions} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="birthDay"
                label="Ngày sinh"
                rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
              >
                <DatePicker
                  className="w-full"
                  placeholder="Chọn ngày sinh"
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input prefix={<HomeOutlined />} placeholder="Địa chỉ" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={isPending}
            >
              Đăng ký
            </Button>
          </Form.Item>

          <Form.Item className="text-center mb-0">
            <span>Đã có tài khoản? </span>
            <a onClick={() => router.push("/login")}>Đăng nhập</a>
          </Form.Item>
        </Form>
        <Button onClick={() => checkName("phungducmanh")}>cc</Button>
      </Card>
    </div>
  );
}
