import { useAddRole } from "@state/account/useAddRole";
import { useReadAllRole } from "@state/role/useReadAllRole";
import { Button, Form, Modal, Select, SelectProps } from "antd";
import React, { useMemo, useState } from "react";

interface FormProps {
  account_uid: string;
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

interface FormData {
  role_uid: string;
}

const AddAccountRoleDialog: React.FC<FormProps> = ({
  open,
  account_uid,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm<FormData>();

  const [selected_role_uid, setSelectedRoleUid] = useState<string | null>(null);

  const { data: role_datas } = useReadAllRole();

  const role_options: SelectProps<string>["options"] = useMemo(() => {
    return role_datas
      ? role_datas.map((item) => ({ label: item.name, value: item.uid }))
      : [];
  }, [role_datas]);

  const { do: addRole, loading } = useAddRole(onSuccess);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      addRole({ account_uid, role_uid: values.role_uid });
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
    <Modal
      title="Thêm quyền"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={500}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="Role"
          name="role_uid"
          rules={[{ validator: validateSelected }]}
        >
          <Select
            options={role_options}
            placeholder="Role"
            value={selected_role_uid}
            showSearch
            onChange={(value: string) => {
              setSelectedRoleUid(value);
            }}
          />
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

export default AddAccountRoleDialog;
