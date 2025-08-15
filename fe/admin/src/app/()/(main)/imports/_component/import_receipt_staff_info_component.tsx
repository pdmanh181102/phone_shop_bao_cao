import LoadingScreen from "@component/loading_screen";
import StaffComponent from "@component/staff_component";
import { useImportReceipt } from "@state/import/useImportReceipt";
import { useRouter } from "next/navigation";
import React from "react";

interface ImportReceiptStaffInfoComponentProps {
  importUid: string;
}

const ImportReceiptStaffInfoComponent: React.FC<
  ImportReceiptStaffInfoComponentProps
> = ({ importUid }) => {
  const router = useRouter();
  const { data, isLoading } = useImportReceipt({ import_uid: importUid });

  if (isLoading) return <LoadingScreen />;
  if (!data) return <></>;
  return <StaffComponent staffUid={data.staffUid} />;
};

export default ImportReceiptStaffInfoComponent;
