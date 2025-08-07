import { getMessageApi } from "@context/MessageContext";
import { useAttributeGroupNames } from "@state/product_attribute/useAttributeGroupNames";
import { useCheckAttributeName } from "@state/product_attribute/useCheckAttributeName";
import { useCreateAttribute } from "@state/product_attribute/useCreateAttribute";
import { AutoComplete, Button, Form, Input, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useMemo, useState } from "react";

interface FormProps {
  product_uid: string;
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  value: string;
  groupName: string;
}

const CreateProductAttributeDialog: React.FC<FormProps> = ({
  product_uid,
  open,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm<FormData>();
  const [groupNames, setGroupNames] = useState<string[]>([]);

  const { getGroupNames } = useAttributeGroupNames((names) => {
    setGroupNames(names);
    console.log("group: ", names);
  });

  useEffect(() => {
    getGroupNames(product_uid);
  }, []);

  const autoCompleteGroupNameOptions = useMemo(
    () => groupNames.map((name) => ({ value: name })),
    [groupNames]
  );

  const { create: createAttribute, loading } = useCreateAttribute(
    product_uid,
    onSuccess
  );

  const { checkName } = useCheckAttributeName(product_uid, () => {
    const name = form.getFieldValue("name");
    const groupName = form.getFieldValue("groupName");
    const values = form.getFieldValue("value");
    const items = values.split("\n").filter((item: string) => item !== "");
    createAttribute({
      name,
      groupName,
      items,
    });
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const items = values.value.split(",").filter((item) => item !== "");
      if (items.length === 0) {
        getMessageApi().error(
          "Giát trị không hợp lệ! Phải có ít nhất một dòng"
        );
        return;
      }
      checkName(values.name);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const validateitemName = async (_: any, value: string) => {
    if (!value || value.trim().length === 0) {
      return Promise.reject(new Error("Vui lòng nhập tên thuộc tính"));
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
    <Modal
      title="Thêm thuộc tính mới"
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
          style={{ marginBottom: 0, marginTop: 24 }}
          label="Tên thuộc tính"
          name="name"
          rules={[{ validator: validateitemName }]}
        >
          <Input placeholder="Nhập tên thuộc tính" maxLength={100} showCount />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 0, marginTop: 24 }}
          label="Giá trị"
          name="value"
          rules={[{ validator: validateitemName }]}
        >
          <TextArea
            placeholder="Nhập giá trị mỗi giá trị trên một hàng"
            maxLength={100}
            showCount
          />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 0, marginTop: 24 }}
          label="Nhóm"
          name="groupName"
        >
          <AutoComplete
            options={autoCompleteGroupNameOptions}
            onChange={(value) => form.setFieldValue("groupName", value)}
            maxLength={100}
          >
            <Input placeholder="Nhập nhóm" showCount />
          </AutoComplete>
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

export default CreateProductAttributeDialog;
