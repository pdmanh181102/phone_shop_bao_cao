import { ProductAttributeApi } from "@/api/client/product_attribute_api";
import { useQuery } from "@tanstack/react-query";

export const useProductAttributes = (product_uid: string) => {
  return useQuery({
    queryKey: ["product_attributes", product_uid],
    queryFn: () => ProductAttributeApi.readAll(product_uid),
  });
};
