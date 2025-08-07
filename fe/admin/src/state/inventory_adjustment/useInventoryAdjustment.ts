import { InventoryAdjustmentApi } from "@api/inventory_adjustment_api";
import { useQuery } from "@tanstack/react-query";

export const useInventoryAdjustment = ({ adjustment_uid }: { adjustment_uid: string }) => {
    return useQuery({
        queryKey: ['inventory_adjustment', adjustment_uid],
        queryFn: () => InventoryAdjustmentApi.readByUid(adjustment_uid)
    });
};
