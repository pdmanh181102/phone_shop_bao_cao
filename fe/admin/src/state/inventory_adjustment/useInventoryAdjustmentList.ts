import { InventoryAdjustmentApi } from "@api/inventory_adjustment_api";
import { InventoryAdjustment } from "@type/inventory_adjustment";
import { usePaginatedQuery } from "../usePaginatedQuery";

export const useInventoryAdjustmentList = ({
    pagination,
    sorter,
    filters,
}: {
    pagination: { current?: number; pageSize?: number };
    sorter: { field?: string; order?: "ascend" | "descend" | null };
    filters: Record<string, any>;
}) => {
    return usePaginatedQuery<InventoryAdjustment>({
        queryKeyPrefix: "inventory_adjustments",
        pagination,
        sorter,
        filters,
        fetcher: ({
            page,
            size,
            sortField,
            sortOrder,
            filters,
        }) => InventoryAdjustmentApi.readAll({ page, size, sortField, sortOrder })
    });
};
