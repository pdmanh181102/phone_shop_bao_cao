import { Button, Form, Input, Modal } from "antd";
import React from "react";

interface FormProps {
    product_uid: string,
    open: boolean;
    onCancel: () => void;
    onSuccess: (product_uid: string, quantity: number) => void;
}

interface FormData {
    quantity: number;
}

const UpdateProductQuantityDialog: React.FC<FormProps> = ({ product_uid, open, onCancel, onSuccess }) => {
    const [form] = Form.useForm<FormData>();

    const handleSubmit = async () => {
        try {
            const { quantity } = await form.validateFields();
            onSuccess(product_uid, quantity);
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    const validateQuantity = async (_: any, value: number) => {
        if (value < 0) {
            return Promise.reject("Số lượng không hợp lệ!");
        }
        return Promise.resolve();
    };

    return (
        <Modal title="Thêm thương hiệu mới" open={open} onCancel={onCancel} footer={null} width={500} destroyOnHidden>
            <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
                <Form.Item
                    label="Số lượng"
                    name="quantity"
                    rules={[{ validator: validateQuantity }]}
                >
                    <Input type="number" min={0} placeholder="Nhập số lượng" showCount />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <Button onClick={onCancel}>Hủy</Button>
                        <Button type="primary" htmlType="submit" >
                            Lưu
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateProductQuantityDialog;