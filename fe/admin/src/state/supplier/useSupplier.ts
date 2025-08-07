import { SupplierApi } from "@api/supplier_api";
import { useQuery } from "@tanstack/react-query";

export const useSupplier = ({ supplier_uid }: { supplier_uid: string }) => {
    return useQuery({
        queryKey: ['supplier', supplier_uid],
        queryFn: () => SupplierApi.readByUid(supplier_uid)
    });
};
