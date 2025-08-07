"use client";

import LoadingScreen from "@component/loading_screen";
import StaffComponent from "@component/staff_component";
import { useImport } from "@state/import/useImport";
import { useReceiptMutation } from "@state/import/useReceiptMutation";
import { Receipt } from "@type/receipt";
import { Breadcrumb, Button, Descriptions, Flex, Tag } from "antd";
import Link from "antd/es/typography/Link";
import Title from "antd/es/typography/Title";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import ImportSupplierInfoComponent from "../_component/import_supplier_info_component";
import ImportItemsComponent from "./_component/import_items_component";

interface ImportDetailPageProps {
  params: Promise<{ import_uid: string }>;
}

const ImportDetailPage: React.FC<ImportDetailPageProps> = ({ params }) => {
  const router = useRouter();
  const [receipt, setReceipt] = useState<Receipt>();
  const { mutate: fetchReceipt, loading: fetchReceiptLoading } =
    useReceiptMutation((rc) => setReceipt(rc));
  const { import_uid } = use(params);
  const { data, isLoading } = useImport({ import_uid });

  useEffect(() => {
    if (data) fetchReceipt(data.uid);
  }, [data]);

  if (isLoading) return <LoadingScreen />;

  function handleCreateReceipt(): void {
    router.push(`/receipts/create?entryUid=${data?.uid}`);
  }

  return (
    <Flex vertical gap={50}>
      <Breadcrumb
        items={[
          {
            title: <Link href="/home">Home</Link>,
          },
          {
            title: <Link href="/imports">Nhập kho</Link>,
          },
          {
            title: data?.uid,
          },
        ]}
      />

      <>
        {data && <Title>{data.reason}</Title>}

        {data && (
          <Descriptions
            column={1}
            styles={{
              label: {
                fontWeight: "bold",
              },
            }}
          >
            <Descriptions.Item label="Uid">{data.uid}</Descriptions.Item>
            <Descriptions.Item label="Nhà cung cấp">
              <ImportSupplierInfoComponent supplier_uid={data.supplierUid} />
            </Descriptions.Item>
            <Descriptions.Item label="Lý do tạo phiếu">
              {data.reason}
            </Descriptions.Item>
            <Descriptions.Item label="Nhân viên">
              <StaffComponent
                staffUid={data.staffUid}
                component={({ staff }) => (
                  <Link
                    onClick={() => router.push(`/users/${staff.uid}`)}
                  >{`${staff.firstName} ${staff.lastName}`}</Link>
                )}
              />
            </Descriptions.Item>
            {receipt && (
              <>
                <Descriptions.Item label="Mã phiếu nhập kho">
                  <Tag color="blue">{receipt.uid}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Nhân viên nhập kho">
                  <StaffComponent
                    staffUid={receipt.staffUid}
                    component={({ staff }) => (
                      <Link
                        onClick={() => router.push(`/users/${staff.uid}`)}
                      >{`${staff.firstName} ${staff.lastName}`}</Link>
                    )}
                  />
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        )}
      </>
      {!!!receipt && (
        <Flex>
          <Button type="primary" onClick={handleCreateReceipt}>
            Tạo phiếu nhập kho
          </Button>
        </Flex>
      )}
      <ImportItemsComponent import_uid={import_uid} />
    </Flex>
  );
};

export default ImportDetailPage;
