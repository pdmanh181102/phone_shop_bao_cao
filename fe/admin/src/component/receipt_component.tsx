import { useReceipt } from "@state/import/useReceipt";
import { Receipt } from "@type/receipt";
import React from "react";
import LoadingScreen from "./loading_screen";

interface ReceiptComponentProps {
  entryUid: string;
  component: React.FC<{ receipt?: Receipt }>;
}

const ReceiptComponent: React.FC<ReceiptComponentProps> = ({
  entryUid,
  component,
}) => {
  const { data, isLoading } = useReceipt(entryUid);

  if (isLoading) return <LoadingScreen />;

  return component({ receipt: data });
};

export default ReceiptComponent;
