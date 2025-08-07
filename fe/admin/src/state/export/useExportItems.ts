import { InventoryExportApi } from "@api/inventory_export_api";
import { useQuery } from "@tanstack/react-query";

export const useExportItems = ({ export_uid }: { export_uid: string }) => {
    return useQuery({
        queryKey: ['export_items', export_uid],
        queryFn: () => InventoryExportApi.readAllItems(export_uid)
    });
};
