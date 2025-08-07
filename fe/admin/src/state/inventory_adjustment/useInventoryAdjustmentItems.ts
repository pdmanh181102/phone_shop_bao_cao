import { InventoryAdjustmentApi } from "@api/inventory_adjustment_api";
import { useQuery } from "@tanstack/react-query";

export const useInventoryAdjustmentItems = ({ adjustment_uid }: { adjustment_uid: string }) => {
    return useQuery({
        queryKey: ['inventory_adjustment_items', adjustment_uid],
        queryFn: () => InventoryAdjustmentApi.readAllItems(adjustment_uid)
    });
};
