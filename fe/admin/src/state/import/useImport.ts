import { InventoryEntryApi } from "@api/inventory_entry_api";
import { useQuery } from "@tanstack/react-query";

export const useImport = ({ import_uid }: { import_uid: string }) => {
    return useQuery({
        queryKey: ['import', import_uid],
        queryFn: () => InventoryEntryApi.readByUid(import_uid),
    });
};
