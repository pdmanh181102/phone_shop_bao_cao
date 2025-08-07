import { useUser } from "@state/user/useUser";
import { User } from "@type/user";
import Link from "antd/es/typography/Link";
import React from "react";
import LoadingScreen from "./loading_screen";

interface StaffComponentProps {
  staffUid: string;
  component?: React.FC<{ staff: User }>;
}

const StaffComponent: React.FC<StaffComponentProps> = ({
  staffUid,
  component,
}) => {
  const { data, isLoading } = useUser({ user_uid: staffUid });

  if (isLoading) return <LoadingScreen />;

  if (!!!data) return <>N/A</>;

  return (
    <>
      {component ? (
        component({ staff: data })
      ) : (
        <Link
          href={`/users/${data.uid}`}
        >{`${data.firstName} ${data.lastName}`}</Link>
      )}
    </>
  );
};

export default StaffComponent;
