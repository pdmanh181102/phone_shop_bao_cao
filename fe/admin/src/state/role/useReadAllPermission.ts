import { PermissionApi } from "@api/permission_api";
import { useQuery } from "@tanstack/react-query";

export const useReadAllPermission = () => {
    return useQuery({
        queryKey: ['permissions'],
        queryFn: () => PermissionApi.readAll()
    });
};
