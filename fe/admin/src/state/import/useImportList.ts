import { InventoryEntryApi } from "@api/inventory_entry_api";
import { InventoryEntry } from "@type/inventory_entry";
import { usePaginatedQuery } from "../usePaginatedQuery";

export const useImportList = ({
    pagination,
    sorter,
    filters,
}: {
    pagination: { current?: number; pageSize?: number };
    sorter: { field?: string; order?: "ascend" | "descend" | null };
    filters: Record<string, any>;
}) => {
    return usePaginatedQuery<InventoryEntry>({
        queryKeyPrefix: "imports",
        pagination,
        sorter,
        filters,
        fetcher: ({
            page,
            size,
            sortField,
            sortOrder,
            filters,
        }) => InventoryEntryApi.readAll({ page, size, sortField, sortOrder })
    });
};
