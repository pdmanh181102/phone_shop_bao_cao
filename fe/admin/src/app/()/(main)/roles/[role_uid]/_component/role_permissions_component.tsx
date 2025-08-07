import { useRolePermissions } from "@state/role/useRolePermissions";
import { Privilege } from "@type/privilege";
import { Button, Flex, Popconfirm, Table, TableColumnsType } from "antd";
import React, { useMemo, useState } from "react";
import CreateRolePrivilegeDialog from "../_dialog/create_privilege_dialog";
import { useRemoveRolePermission } from "@state/role/useRemoveRolePermission";

interface RolePermissionComponentProps {
  role_uid: string;
}

const RolePermissionComponent: React.FC<RolePermissionComponentProps> = ({
  role_uid,
}) => {
  const [openDialog, setOpenDialog] = useState<string>("closed");

  const {
    data: privilegeDatas,
    isPending,
    refetch,
  } = useRolePermissions({ role_uid });

  const {delete: removeRolePermission, loading: isRemoving} = useRemoveRolePermission(() => refetch());

  const columns: TableColumnsType<Privilege> = useMemo(
    () => [
      {
        title: "permission",
        dataIndex: "permission",
        key: "permission",
        width: "200px",
      },
      {
        title: "resource",
        dataIndex: "resource",
        key: "resource",
      },
      {
        title: "Thao tác",
        render: (_: any, record: Privilege) => (
          <Flex gap={10}>
            <Popconfirm
              title="Gỡ"
              description={`Xác nhận gỡ?`}
              onConfirm={() => removeRolePermission(record.uid)}
              okText="Gỡ"
              cancelText="Hủy"
              okType="danger"
            >
              <Button type="primary" danger size="small" loading={isRemoving}>
                Gỡ
              </Button>
            </Popconfirm>
          </Flex>
        ),
      },
    ],
    [privilegeDatas]
  );

  return (
    <Flex vertical gap={10}>
      <Table
        pagination={false}
        scroll={{ x: "max-content" }}
        rowKey={"uid"}
        dataSource={privilegeDatas?.content}
        columns={columns}
        loading={isPending}
      />
      <Flex>
        <Button
          size="small"
          type="primary"
          onClick={() => setOpenDialog("create")}
        >
          Thêm
        </Button>
      </Flex>
      <CreateRolePrivilegeDialog
        open={openDialog === "create"}
        onCancel={() => setOpenDialog("closed")}
        onSuccess={() => {
          refetch();
          setOpenDialog("closed");
        }}
        role_uid={role_uid}
      />
    </Flex>
  );
};

export default RolePermissionComponent;
