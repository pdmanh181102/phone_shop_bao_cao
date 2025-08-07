import { RoleApi } from "@api/role_api";
import { useQuery } from "@tanstack/react-query";

export const useReadAllRole = () => {
    return useQuery({
        queryKey: ['read_all_roles'],
        queryFn: () => RoleApi.readAllRoles()
    });
};
