import { InventoryEntryApi } from "@api/inventory_entry_api";
import { useQuery } from "@tanstack/react-query";

export const useImportReceipt = ({ import_uid }: { import_uid: string }) => {
    return useQuery({
        queryKey: ['import_receipt', import_uid],
        queryFn: () => InventoryEntryApi.getReceipt(import_uid),
    });
};
