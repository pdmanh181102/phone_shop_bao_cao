import { SupplierApi } from "@api/supplier_api";
import { Supplier } from "@type/supplier";
import { usePaginatedQuery } from "../usePaginatedQuery";

export const useSupplierList = ({
    pagination,
    sorter,
    filters,
}: {
    pagination?: { current?: number; pageSize?: number };
    sorter?: { field?: string; order?: "ascend" | "descend" | null };
    filters?: Record<string, any>;
}) => {
    return usePaginatedQuery<Supplier>({
        queryKeyPrefix: "suppliers",
        pagination,
        sorter,
        filters,
        fetcher: ({
            page,
            size,
            sortField,
            sortOrder,
            filters,
        }) => SupplierApi.readAll({ page, size, sortField, sortOrder })
    });
};
