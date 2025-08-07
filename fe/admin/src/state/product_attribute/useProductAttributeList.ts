import { ProductAttributeApi } from "@api/product_attribute_api";
import { useQuery } from "@tanstack/react-query";

export const useProductAttributeList = (product_uid: string) => {
    return useQuery({
        queryKey: ["product_attribute", product_uid],
        queryFn: () => ProductAttributeApi.readAll(product_uid)
    });
};
