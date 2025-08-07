import { useCreatePrivilege } from "@state/role/useCreatePrivilege";
import { useReadAllPermission } from "@state/role/useReadAllPermission";
import { useReadAllResource } from "@state/role/useReadAllResource";
import { Button, Form, Modal, Select, SelectProps } from "antd";
import React, { useEffect, useMemo, useState } from "react";

interface FormProps {
  role_uid: string;
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

interface FormData {
  permission: string;
  resource: string;
}

const CreateRolePrivilegeDialog: React.FC<FormProps> = ({
  open,
  role_uid,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm<FormData>();

  const [selected_permission, setSelectedPermission] = useState<string | null>(
    null
  );
  const [selected_resource, setSelectedResource] = useState<string | null>(
    null
  );

  const { data: permission_datas } = useReadAllPermission();

  const { data: resource_datas } = useReadAllResource();

  useEffect(() => {
    if (permission_datas) setSelectedPermission(permission_datas[0].uid);
  }, [permission_datas]);

  useEffect(() => {
    if (resource_datas) setSelectedResource(resource_datas[0].uid);
  }, [resource_datas]);

  const permission_options: SelectProps<string>["options"] = useMemo(
    () =>
      permission_datas?.map((item) => ({ label: item.label, value: item.uid })),
    [permission_datas]
  );
  const resouce_options: SelectProps<string>["options"] = useMemo(
    () =>
      resource_datas?.map((item) => ({ label: item.label, value: item.uid })),
    [resource_datas]
  );

  const { create: createPrivilege, loading } = useCreatePrivilege(onSuccess);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      createPrivilege({
        role_uid: role_uid,
        permission: values.permission,
        resource: values.resource,
      });
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
      title="Thêm quyền hạn"
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
          label="Permission"
          name="permission"
          rules={[{ validator: validateSelected }]}
        >
          {selected_permission && (
            <Select
              options={permission_options}
              placeholder="Permission"
              value={selected_permission}
              showSearch
              onChange={(value: string) => {
                setSelectedPermission(value);
              }}
            />
          )}
        </Form.Item>
        <Form.Item
          label="Resource"
          name="resource"
          rules={[{ validator: validateSelected }]}
        >
          {selected_permission && (
            <Select
              options={resouce_options}
              placeholder="Resource"
              value={selected_resource}
              showSearch
              onChange={(value: string) => {
                setSelectedResource(value);
              }}
            />
          )}
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

export default CreateRolePrivilegeDialog;
