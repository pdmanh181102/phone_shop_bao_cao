import { SupplierApi } from "@api/supplier_api";
import { useQuery } from "@tanstack/react-query";

export const useAllSupplier = () => {
    return useQuery({
        queryKey: ['suppliers'],
        queryFn: () => SupplierApi.readAll({})
    });
};
