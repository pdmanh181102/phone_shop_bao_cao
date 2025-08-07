import { useCheckRoleName } from "@state/role/useCheckRoleName";
import { useCreateRole } from "@state/role/useCreateRole";
import { Button, Form, Input, Modal } from "antd";
import React from "react";

interface FormProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
}

interface FormData {
    name: string;
}

const CreateRoleDialog: React.FC<FormProps> = ({ open, onCancel, onSuccess }) => {
    const [form] = Form.useForm<FormData>();

    const { create: createRole, loading } = useCreateRole(onSuccess);

    const { checkName } = useCheckRoleName(async () => createRole({ name: form.getFieldValue("name") }))

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            checkName(values.name)
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    const validateitemName = async (_: any, value: string) => {
        if (!value || value.trim().length === 0) {
            return Promise.reject(new Error("Vui lòng nhập tên dòng sản phẩm"));
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
        <Modal title="Thêm role" open={open} onCancel={onCancel} footer={null} width={500} destroyOnHidden>
            <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
                <Form.Item
                    label="Tên"
                    name="name"
                    rules={[{ validator: validateitemName }]}
                >
                    <Input placeholder="Nhập tên" maxLength={100} showCount />
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

export default CreateRoleDialog;