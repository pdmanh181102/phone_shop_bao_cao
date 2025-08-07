import { RoleApi } from "@api/role_api";
import { Role } from "@type/role";
import { usePaginatedQuery } from "../usePaginatedQuery";

export const useRoleList = ({
    pagination,
    sorter,
    filters,
}: {
    pagination: { current?: number; pageSize?: number };
    sorter: { field?: string; order?: "ascend" | "descend" | null };
    filters: Record<string, any>;
}) => {
    return usePaginatedQuery<Role>({
        queryKeyPrefix: "roles",
        pagination,
        sorter,
        filters,
        fetcher: ({
            page,
            size,
            sortField,
            sortOrder,
            filters,
        }) => RoleApi.readAll({ page, size, sortField, sortOrder })
    });
};
