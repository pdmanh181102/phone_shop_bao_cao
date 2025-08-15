import LoadingScreen from "@component/loading_screen";
import { useExportStaff } from "@state/export/useExportStaff";
import Link from "antd/es/typography/Link";
import React from "react";

interface ExportStaffInfoComponentProps {
  export_uid: string;
}

const ExportStaffInfoComponent: React.FC<ExportStaffInfoComponentProps> = ({
  export_uid,
}) => {
  const { data, isLoading } = useExportStaff({ export_uid });

  if (isLoading) return <LoadingScreen />;

  return (
    <Link
      href={`/users/${data?.uid}`}
    >{`${data?.firstName} ${data?.lastName}`}</Link>
  );
};

export default ExportStaffInfoComponent;
