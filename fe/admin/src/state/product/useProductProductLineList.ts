import { ProductApi } from "@api/product_api";
import { useQuery } from "@tanstack/react-query";

export const useProductProductLineList = (product_uid: string, connected: boolean) => {
    return useQuery({
        queryKey: ["produdct_product_lines", product_uid, connected],
        queryFn: () => ProductApi.readAllProductLines(product_uid, connected)
    });
};
