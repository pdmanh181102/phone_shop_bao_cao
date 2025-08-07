import { useUpdateProductStatus } from "@state/product/useUpdateProductStatus";
import { useProductStatusList } from "@state/product_status/useProductStatusList";
import { Button, Form, Modal, Select, SelectProps } from "antd";
import React, { useEffect, useMemo, useState } from "react";

interface FormProps {
    product_uid: string,
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
}

interface FormData {
    status_uid: string;
}

const UpdateProductStatusDialog: React.FC<FormProps> = ({ product_uid, open, onCancel, onSuccess }) => {
    const [form] = Form.useForm<FormData>();

    const [selected_status_uid, setSelectedStatusUid] = useState<string | null>(null);


    const { data: product_status_datas } = useProductStatusList();

    const status_options: SelectProps<string>['options'] = useMemo(() => product_status_datas?.map(item => ({ label: item.label, value: item.uid })), [product_status_datas])

    useEffect(() => {
        if (product_status_datas)
            setSelectedStatusUid(product_status_datas[0].uid)
    }, [product_status_datas]);

    const { updateStatus, loading } = useUpdateProductStatus(onSuccess);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            updateStatus({
                product_uid,
                status: values.status_uid
            })
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    const validateitemStatus = async (_: any, value: string) => {
        if (!value || value.trim().length === 0) {
            return Promise.reject(new Error("Vui lòng nhập tên sản phẩm"));
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
        <Modal title="Thêm sản phẩm mới" open={open} onCancel={onCancel} footer={null} width={500} destroyOnHidden>
            <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
                <Form.Item
                    label="Trạng thái"
                    name="status_uid"
                    rules={[{ validator: validateitemStatus }]}
                >
                    {selected_status_uid && <Select options={status_options} placeholder="Trạng thái" value={selected_status_uid} showSearch onChange={(value: string) => {
                        setSelectedStatusUid(value);
                    }} />}
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

export default UpdateProductStatusDialog;