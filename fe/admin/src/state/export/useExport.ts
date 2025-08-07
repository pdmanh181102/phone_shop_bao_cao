import { InventoryExportApi } from "@api/inventory_export_api";
import { useQuery } from "@tanstack/react-query";

export const useExport = ({ export_uid }: { export_uid: string }) => {
    return useQuery({
        queryKey: ['export', export_uid],
        queryFn: () => InventoryExportApi.readByUid(export_uid)
    });
};
