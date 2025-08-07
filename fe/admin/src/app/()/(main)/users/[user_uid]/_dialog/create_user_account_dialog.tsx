import { useCheckAccountUsername } from "@state/account/useCheckAccountUsername";
import { useCreateUserAccount } from "@state/account/useCreateUserAccount";
import { Button, Form, Input, Modal } from "antd";
import React from "react";

interface FormProps {
    user_uid: string,
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
}

interface FormData {
    username: string;
    password: string;
    password2: string;
}

const CreateUserAccountDialog: React.FC<FormProps> = ({ user_uid, open, onCancel, onSuccess }) => {
    const [form] = Form.useForm<FormData>();

    const { create: createAccount, loading: creatingAccount } = useCreateUserAccount(onSuccess);

    const { checkName, loading } = useCheckAccountUsername(async () => createAccount({
        user_uid: user_uid,
        username: form.getFieldValue("username"),
        password: form.getFieldValue("password"),
        password2: form.getFieldValue("password2")
    }))

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            checkName(values.username)
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    const validateitemName = async (_: any, value: string) => {
        if (!value || value.trim().length === 0) {
            return Promise.reject(new Error("Vui lòng nhập tên tài khoản"));
        }

        if (value.trim().length < 2) {
            return Promise.reject(new Error("Tên phải có ít nhất 2 ký tự"));
        }

        if (value.trim().length > 100) {
            return Promise.reject(new Error("Tên không được vượt quá 100 ký tự"));
        }

        return Promise.resolve();
    };

    return (
        <Modal title="Thêm tài khoản mới" open={open} onCancel={onCancel} footer={null} width={500} destroyOnHidden>
            <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ validator: validateitemName }]}
                >
                    <Input placeholder="Nhập username" maxLength={50} showCount />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ validator: validateitemName }]}
                >
                    <Input placeholder="Nhập mật khẩu" maxLength={50} showCount />
                </Form.Item>


                <Form.Item
                    label="Nhập lại mật khẩu"
                    name="password2"
                    rules={[{ validator: validateitemName }]}
                >
                    <Input placeholder="Nhập mật khẩu" maxLength={50} showCount />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <Button onClick={onCancel}>Hủy</Button>
                        <Button type="primary" htmlType="submit" loading={creatingAccount}>
                            Lưu
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateUserAccountDialog;