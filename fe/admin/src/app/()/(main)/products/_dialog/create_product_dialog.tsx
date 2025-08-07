import { useAllBrand } from "@state/brand/useAllBrand";
import { useCheckProductName } from "@state/product/useCheckProductName";
import { useCreateProduct } from "@state/product/useCreateProduct";
import { Button, Form, Input, Modal, Select, SelectProps } from "antd";
import React, { useEffect, useMemo, useState } from "react";

interface FormProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
}

interface FormData {
    name: string;
    brand_uid: string
}

const CreateProductDialog: React.FC<FormProps> = ({ open, onCancel, onSuccess }) => {
    const [form] = Form.useForm<FormData>();

    const [selected_brand_uid, setSelectedBrandUid] = useState<string | null>(null);

    const { data: brand_datas, isFetching: is_brands_fetching } = useAllBrand();


    useEffect(() => {
        if (brand_datas)
            setSelectedBrandUid(brand_datas.content[0]?.uid)
    }, [brand_datas]);

    const brand_options: SelectProps<string>['options'] = useMemo(() => brand_datas?.content?.map(item => ({ label: item.name, value: item.uid })), [brand_datas])

    const { create: CreateProduct, loading } = useCreateProduct(onSuccess);

    const { checkName } = useCheckProductName(() => CreateProduct({
        brand_uid: form.getFieldValue("brand_uid"),
        name: form.getFieldValue("name"),
    }))

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            checkName({
                brand_uid: values.brand_uid,
                name: values.name
            })
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    const validateitemBrandUid = async (_: any, value: string) => {
        if (!value || value.trim().length === 0) {
            return Promise.reject(new Error("Vui lòng chọn thương hiệu"));
        }

        return Promise.resolve();
    };

    const validateitemName = async (_: any, value: string) => {
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
                    label="Thương hiệu"
                    name="brand_uid"
                    rules={[{ validator: validateitemBrandUid }]}
                >
                    <Select options={brand_options} placeholder="Thương hiệu" value={selected_brand_uid} showSearch onChange={(value: string) => {
                        setSelectedBrandUid(value);
                    }} />
                </Form.Item>
                <Form.Item style={{ marginBottom: 0, marginTop: 24 }}
                    label="Tên sản phẩm"
                    name="name"
                    rules={[{ validator: validateitemName }]}
                >
                    <Input placeholder="Nhập tên sản phẩm" maxLength={100} showCount />
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

export default CreateProductDialog;