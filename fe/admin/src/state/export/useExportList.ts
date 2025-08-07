import { InventoryExportApi } from "@api/inventory_export_api";
import { InventoryExport } from "@type/inventory_export";
import { usePaginatedQuery } from "../usePaginatedQuery";

export const useExportList = ({
    pagination,
    sorter,
    filters,
}: {
    pagination: { current?: number; pageSize?: number };
    sorter: { field?: string; order?: "ascend" | "descend" | null };
    filters: Record<string, any>;
}) => {
    return usePaginatedQuery<InventoryExport>({
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
        }) => InventoryExportApi.readAll({ page, size, sortField, sortOrder })
    });
};
