import { CustomerApi } from "@api/customer_api";
import { Customer } from "@type/customer";
import { usePaginatedQuery } from "../usePaginatedQuery";

export const useCustomerList = ({
    pagination,
    sorter,
    filters,
}: {
    pagination: { current?: number; pageSize?: number };
    sorter: { field?: string; order?: "ascend" | "descend" | null };
    filters: Record<string, any>;
}) => {
    return usePaginatedQuery<Customer>({
        queryKeyPrefix: "customers",
        pagination,
        sorter,
        filters,
        fetcher: ({
            page,
            size,
            sortField,
            sortOrder,
            filters,
        }) => CustomerApi.readAll({ page, size, sortField, sortOrder })
    });
};
