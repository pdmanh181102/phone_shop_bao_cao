import LoadingScreen from "@component/loading_screen";
import { useExportCustomer } from "@state/export/useExportCustomer";
import Link from "antd/es/typography/Link";
import React from "react";

interface ExportCustomerInfoComponentProps {
  export_uid: string;
}

const ExportCustomerInfoComponent: React.FC<
  ExportCustomerInfoComponentProps
> = ({ export_uid }) => {
  const { data, isLoading } = useExportCustomer({ export_uid });

  if (isLoading) return <LoadingScreen />;

  return (
    <Link
      href={`/customers/${data?.uid}`}
    >{`${data?.firstName} ${data?.lastName}`}</Link>
  );
};

export default ExportCustomerInfoComponent;
