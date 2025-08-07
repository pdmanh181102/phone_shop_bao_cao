"use client";

import LoadingScreen from "@component/loading_screen";
import { useImportMutation } from "@state/import/useImportMutation";
import { useCreateReceipt } from "@state/receipt/useCreateReceipt";
import { InventoryEntry } from "@type/inventory_entry";
import { Button, Flex, Form, Input } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ReceiptImportItemsComponent from "./import_items_component";

interface FormFields {
  entryUid: string;
  note?: string;
}

const ReceiptPage: React.FC = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const entryUid = searchParams.get("entryUid");

  const [entry, setEntry] = useState<InventoryEntry>();
  const [form] = Form.useForm<FormFields>();

  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const { mutate: fetchEntry, loading: fetchEntryLoading } = useImportMutation(
    (entryData) => {
      setEntry(entryData);
      form.setFieldsValue({ entryUid: entryData.uid });
    }
  );

  const { create: createReceipt, loading: createReceiptPending } =
    useCreateReceipt(() => router.push(`/imports/${entryUid}`));

  useEffect(() => {
    if (entryUid) fetchEntry(entryUid);
  }, [entryUid]);

  if (!entryUid || fetchEntryLoading) return <LoadingScreen />;

  const handleFinish = (values: FormFields) => {
    const { entryUid, note } = values;
    const quantityList = Object.entries(quantities).map(
      ([entryItemUid, quantity]) => ({
        entryItemUid,
        quantity,
      })
    );

    createReceipt({ entryUid, note, items: quantityList });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ entryUid }}
      onFinish={handleFinish}
    >
      <Form.Item
        label="Mã phiếu nhập (Entry UID)"
        name="entryUid"
        rules={[{ required: true }]}
      >
        <Input disabled />
      </Form.Item>

      <Form.Item label="Ghi chú" name="note">
        <Input.TextArea placeholder="Nhập ghi chú (nếu có)" rows={3} />
      </Form.Item>

      <ReceiptImportItemsComponent
        import_uid={entryUid}
        onQuantitiesChange={setQuantities}
      />

      <Flex justify="end">
        <Button type="primary" htmlType="submit" loading={createReceiptPending}>
          Lưu
        </Button>
      </Flex>
    </Form>
  );
};

export default ReceiptPage;
