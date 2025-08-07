import { InventoryEntryApi } from "@api/inventory_entry_api";
import { useQuery } from "@tanstack/react-query";

export const useReceipt = (receiptUid: string) => {
    return useQuery({
        queryKey: ['receipt', receiptUid],
        queryFn: () => InventoryEntryApi.getReceipt(receiptUid,),
    });
};
