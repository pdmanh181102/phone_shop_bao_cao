"use client";

import { useLogin } from "@/api/state/auth/useLogin";
import { Button, Card, Flex, Form, Input } from "antd";
import Title from "antd/es/typography/Title";
import { useRouter } from "next/navigation";
import React from "react";

interface FormData {
  username: string;
  password: string;
}

interface PageLoginClientProps {
  redirectTo: string;
}

const PageLoginClient: React.FC<PageLoginClientProps> = ({ redirectTo }) => {
  const [form] = Form.useForm<FormData>();
  const router = useRouter();

  const { mutate: mutateLogin, isPending: loginPending } = useLogin(() =>
    router.push(redirectTo)
  );

  const onFinish = ({ username, password }: FormData) => {
    mutateLogin({ username, password });
  };

  return (
    <Flex justify="center" align="center" style={{ height: "100vh" }}>
      <Card style={{ width: 300 }}>
        <Flex vertical gap={10}>
          <Title level={3} style={{ textAlign: "center" }}>
            Đăng nhập
          </Title>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[
                { required: true, message: "Vui lòng nhập tên đăng nhập" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loginPending}
                block
              >
                Đăng nhập
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="link"
                block
                onClick={() => router.push("/forgot-password")}
                style={{ padding: 0 }}
              >
                Quên mật khẩu?
              </Button>
            </Form.Item>
          </Form>
        </Flex>
      </Card>
    </Flex>
  );
};

export default PageLoginClient;
