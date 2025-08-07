"use client";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useAuthories } from "@state/auth/useAuthories";
import { useLogin } from "@state/auth/useLogin";
import { Button, Card, Form, Input } from "antd";
import { useRouter } from "next/navigation";

interface FormData {
  username: string;
  password: string;
}

export default function LoginPage() {
  const [form] = Form.useForm<FormData>();
  const router = useRouter();

  const { mutate: mutateAuthoRies, isPending: authoriesPending } = useAuthories(
    () => router.push("/")
  );

  const { mutate: mutateLogin, isPending: loginPending } = useLogin(() =>
    mutateAuthoRies()
  );

  const onFinish = ({ username, password }: FormData) => {
    mutateLogin({ username, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card
        title="Đăng nhập"
        className="w-full max-w-md shadow-lg rounded-2xl"
        styles={{
          header: { textAlign: "center", fontSize: 20 },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ username: "", password: "" }}
        >
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

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loginPending || authoriesPending}
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <Form.Item className="text-center mb-0">
            <span>Chưa có tài khoản? </span>
            <a onClick={() => router.push("/register")}>Đăng ký</a>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
