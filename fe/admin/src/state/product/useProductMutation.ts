import { ProductApi } from "@api/product_api";
import { getMessageApi } from "@context/MessageContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Product } from "@type/product";

export const useProductMutation = (success: (product: Product) => any) => {
  const createMutation = useMutation({
    mutationFn: (productUid: string) => ProductApi.readByUid(productUid),
    onSuccess: (result: Product) => {
      success(result);
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "Lỗi");
    },
  });

  return { fetch: createMutation.mutate, loading: createMutation.isPending };
};
