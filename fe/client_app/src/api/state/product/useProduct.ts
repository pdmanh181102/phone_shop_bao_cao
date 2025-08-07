import { ProductApi } from "@/api/client/product_api";
import { Product } from "@/api/type/product";
import { getMessageApi } from "@/context/MessageContext";
import { useMutation } from "@tanstack/react-query";

export const useProduct = (onSuccess: (product: Product) => any) => {
  return useMutation({
    mutationFn: (productUid: string) => ProductApi.readByUid(productUid),
    onSuccess: (result) => onSuccess(result),
    onError: (error) => getMessageApi().error(error.message),
  });
};
