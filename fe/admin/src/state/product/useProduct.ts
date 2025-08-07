import { ProductApi } from "@api/product_api";
import { useQuery } from "@tanstack/react-query";

export const useProduct = ({ product_uid }: { product_uid: string | null }) => {
  return useQuery({
    queryKey: ["product", product_uid],
    queryFn: () => ProductApi.readByUid(product_uid!),
    enabled: !!product_uid,
  });
};
