import { InventoryEntryApi } from "@api/inventory_entry_api";
import { useQuery } from "@tanstack/react-query";

export const useImportItems = ({ import_uid }: { import_uid: string }) => {
    return useQuery({
        queryKey: ['import_items', import_uid],
        queryFn: () => InventoryEntryApi.readAllItems(import_uid)
    });
};
