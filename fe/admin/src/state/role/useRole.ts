import { RoleApi } from "@api/role_api";
import { useQuery } from "@tanstack/react-query";

export const useRole = ({ role_uid }: { role_uid: string }) => {
    return useQuery({
        queryKey: ['role', role_uid],
        queryFn: () => RoleApi.readByUid(role_uid)
    });
};
