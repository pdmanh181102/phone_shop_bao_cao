import { InventoryExportApi } from "@api/inventory_export_api";
import { useQuery } from "@tanstack/react-query";

export const useExportStaff = ({ export_uid }: { export_uid: string }) => {
    return useQuery({
        queryKey: ['export_staff', export_uid],
        queryFn: () => InventoryExportApi.readStaff(export_uid)
    });
};
