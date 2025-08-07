import { useReadAllGender } from "@state/user/useReadAllGender";
import { useUpdateUserGender } from "@state/user/useUpdateUserGender";
import { Button, Form, Modal, Select, SelectProps } from "antd";
import React, { useEffect, useMemo, useState } from "react";

interface FormProps {
    user_uid: string,
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
}

interface FormData {
    gender: string;
}

const UpdateGenderDialog: React.FC<FormProps> = ({ user_uid, open, onCancel, onSuccess }) => {
    const [form] = Form.useForm<FormData>();

    const [selected_gender, setSelectedGender] = useState<string | null>(null);

    const { data: gender_datas } = useReadAllGender();

    useEffect(() => {
        if (gender_datas)
            setSelectedGender(gender_datas[0].uid)
    }, [gender_datas]);

    const gender_options: SelectProps<string>['options'] = useMemo(() => gender_datas?.map(item => ({ label: item.label, value: item.uid })), [gender_datas])


    const { updateName: updateUserGender, loading } = useUpdateUserGender(onSuccess);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            updateUserGender({ user_uid, gender: values.gender })
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    const validateSelected = async (_: any, value: string) => {
        if (!value || value.trim().length === 0) {
            return Promise.reject(new Error("Vui lòng chọn trường này"));
        }
        return Promise.resolve();
    };
    return (
        <Modal title="Cập nhật tên" open={open} onCancel={onCancel} footer={null} width={500} destroyOnHidden>
            <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
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
                            Lưu
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateGenderDialog;