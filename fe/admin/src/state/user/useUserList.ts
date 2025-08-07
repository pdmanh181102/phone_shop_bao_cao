import { UserApi } from "@api/user_api";
import { User } from "@type/user";
import { usePaginatedQuery } from "../usePaginatedQuery";

export const useUserList = ({
    pagination,
    sorter,
    filters,
}: {
    pagination: { current?: number; pageSize?: number };
    sorter: { field?: string; order?: "ascend" | "descend" | null };
    filters: Record<string, any>;
}) => {
    return usePaginatedQuery<User>({
        queryKeyPrefix: "users",
        pagination,
        sorter,
        filters,
        fetcher: ({
            page,
            size,
            sortField,
            sortOrder,
            filters,
        }) => UserApi.readAll({ page, size, sortField, sortOrder })
    });
};
