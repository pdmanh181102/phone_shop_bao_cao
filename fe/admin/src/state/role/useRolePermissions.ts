import { PrivilegeApi } from "@api/privilege_api";
import { useQuery } from "@tanstack/react-query";

export const useRolePermissions = ({ role_uid }: { role_uid: string }) => {
    return useQuery({
        queryKey: ['order_items', role_uid],
        queryFn: () => PrivilegeApi.readAll(role_uid)
    });
};
