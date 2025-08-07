import { useForceChangePassword } from "@state/account/useForceChangePassword";
import { Button, Form, Input, Modal } from "antd";
import React from "react";

interface FormProps {
    account_uid: string,
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
}

interface FormData {
    password: string;
    password2: string;
}

const FUpdateAccountPasswordDialog: React.FC<FormProps> = ({ account_uid, open, onCancel, onSuccess }) => {
    const [form] = Form.useForm<FormData>();

    const { do: updatePassword, loading } = useForceChangePassword(onSuccess)

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            updatePassword({ account_uid, password: values.password, password2: values.password2 })
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    const validateitemField = async (_: any, value: string) => {
        if (!value || value.trim().length === 0) {
            return Promise.reject(new Error("Vui lòng nhập"));
        }

        if (value.trim().length > 100) {
            return Promise.reject(new Error("Tên không được vượt quá 100 ký tự"));
        }

        return Promise.resolve();
    };

    return (
        <Modal title="Cập nhật password" open={open} onCancel={onCancel} footer={null} width={500} destroyOnHidden>
            <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ validator: validateitemField }]}
                >
                    <Input placeholder="Nhập password" maxLength={100} showCount />
                </Form.Item>

                <Form.Item
                    label="Nhập lại mật khẩu"
                    name="password2"
                    rules={[{ validator: validateitemField }]}
                >
                    <Input placeholder="Nhập lại password" maxLength={100} showCount />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <Button onClick={onCancel}>Hủy</Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Lưu
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default FUpdateAccountPasswordDialog;