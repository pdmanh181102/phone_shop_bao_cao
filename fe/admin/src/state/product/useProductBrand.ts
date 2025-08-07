import { ProductApi } from "@api/product_api";
import { useQuery } from "@tanstack/react-query";

export const useProductBrand = ({ product_uid }: { product_uid: string }) => {
  return useQuery({
    queryKey: ["product_brand", product_uid],
    queryFn: () => ProductApi.readBrandByProductUid(product_uid),
  });
};
