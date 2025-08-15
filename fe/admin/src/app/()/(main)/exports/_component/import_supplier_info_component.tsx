import LoadingScreen from "@component/loading_screen";
import { useSupplier } from "@state/supplier/useSupplier";
import React from "react";

interface ImportSupplierInfoComponentProps {
  supplier_uid: string;
}

const ImportSupplierInfoComponent: React.FC<
  ImportSupplierInfoComponentProps
> = ({ supplier_uid }) => {
  const { data, isLoading } = useSupplier({ supplier_uid });

  if (isLoading) return <LoadingScreen />;

  return <span>{data?.name}</span>;
};

export default ImportSupplierInfoComponent;
