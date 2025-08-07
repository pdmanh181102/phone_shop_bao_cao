import { useCreateUser } from "@state/user/useCreateUser";
import { useReadAllGender } from "@state/user/useReadAllGender";
import { Button, Form, Input, Modal, Select, SelectProps } from "antd";
import React, { useEffect, useMemo, useState } from "react";

interface FormProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
}

interface FormData {
    first_name: string;
    last_name: string;
    gender: string;
}

const CreateUserDialog: React.FC<FormProps> = ({ open, onCancel, onSuccess }) => {
    const [form] = Form.useForm<FormData>();

    const [selected_gender, setSelectedGender] = useState<string | null>(null);

    const { data: gender_datas } = useReadAllGender();

    useEffect(() => {
        if (gender_datas)
            setSelectedGender(gender_datas[0].uid)
    }, [gender_datas]);

    const gender_options: SelectProps<string>['options'] = useMemo(() => gender_datas?.map(item => ({ label: item.label, value: item.uid })), [gender_datas])

    const { create: createUser, loading } = useCreateUser(onSuccess);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            createUser({
                firsrt_name: values.first_name,
                last_name: values.last_name,
                gender: values.gender
            })
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    const validateitemFirstName = async (_: any, value: string) => {
        if (!value || value.trim().length === 0) {
            return Promise.reject(new Error("Vui lòng nhập họ user"));
        }
        if (value.trim().length < 2) {
            return Promise.reject(new Error("Họ phải có ít nhất 2 ký tự"));
        }
        if (value.trim().length > 100) {
            return Promise.reject(new Error("Họ không được vượt quá 100 ký tự"));
        }
        return Promise.resolve();
    };

    const validateitemLastName = async (_: any, value: string) => {
        if (!value || value.trim().length === 0) {
            return Promise.reject(new Error("Vui lòng nhập tên user"));
        }
        if (value.trim().length < 2) {
            return Promise.reject(new Error("Tên phải có ít nhất 2 ký tự"));
        }
        if (value.trim().length > 100) {
            return Promise.reject(new Error("Tên không được vượt quá 100 ký tự"));
        }
        return Promise.resolve();
    };

    const validateSelected = async (_: any, value: string) => {
        if (!value || value.trim().length === 0) {
            return Promise.reject(new Error("Vui lòng chọn trường này"));
        }
        return Promise.resolve();
    };

    return (
        <Modal title="Thêm user mới" open={open} onCancel={onCancel} footer={null} width={500} destroyOnHidden>
            <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
                <Form.Item
                    label="Họ"
                    name="first_name"
                    rules={[{ validator: validateitemFirstName }]}
                >
                    <Input placeholder="Nhập họ" maxLength={50} showCount />
                </Form.Item>

                <Form.Item
                    label="Tên"
                    name="last_name"
                    rules={[{ validator: validateitemLastName }]}
                >
                    <Input placeholder="Nhập tên" maxLength={50} showCount />
                </Form.Item>

                <Form.Item
                    label="Giới tính"
                    name="gender"
                    rules={[{ validator: validateSelected }]}
                >
                    {selected_gender && <Select options={gender_options} placeholder="Giới tính" value={selected_gender} showSearch onChange={(value: string) => {
                        setSelectedGender(value);
                    }} />}
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <Button onClick={onCancel}>Hủy</Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Thêm user
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateUserDialog;