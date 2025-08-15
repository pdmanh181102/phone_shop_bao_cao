import { InventoryExportApi } from "@api/inventory_export_api";
import { useQuery } from "@tanstack/react-query";

export const useExportCustomer = ({ export_uid }: { export_uid: string }) => {
    return useQuery({
        queryKey: ['export_customer', export_uid],
        queryFn: () => InventoryExportApi.readCustomer(export_uid)
    });
};
