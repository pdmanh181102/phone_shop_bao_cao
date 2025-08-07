import { useUpdateProductPrice } from "@state/product/useUpdateProductPrice";
import { Button, Form, Input, Modal } from "antd";
import React from "react";

interface FormProps {
    product_uid: string,
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
}

interface FormData {
    price: number;
}

const UpdateProductPriceDialog: React.FC<FormProps> = ({ product_uid, open, onCancel, onSuccess }) => {
    const [form] = Form.useForm<FormData>();

    const { updatePrice, loading } = useUpdateProductPrice(onSuccess);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            updatePrice({
                product_uid,
                price: values.price
            })
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    const validateitemName = async (_: any, value: number) => {
        if (value < 0) {
            return Promise.reject("Giá không thể âm!");
        }

        return Promise.resolve();
    };

    return (
        <Modal title="Cập nhật giá" open={open} onCancel={onCancel} footer={null} width={500} destroyOnHidden>
            <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
                <Form.Item
                    label="Giá"
                    name="price"
                    rules={[{ validator: validateitemName }]}
                >
                    <Input type="number" placeholder="Nhập giá" maxLength={100} showCount />
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

export default UpdateProductPriceDialog;