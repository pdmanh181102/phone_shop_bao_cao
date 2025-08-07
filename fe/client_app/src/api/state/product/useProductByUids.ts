import { ProductApi } from "@/api/client/product_api";
import { Product } from "@/api/type/product";
import { getMessageApi } from "@/context/MessageContext";
import { useMutation } from "@tanstack/react-query";

export const useProductByUids = (onSuccess: (products: Product[]) => any) => {
  return useMutation({
    mutationFn: (productUids: string[]) => ProductApi.readByUids(productUids),
    onSuccess: (result) => onSuccess(result),
    onError: (error) => getMessageApi().error(error.message),
  });
};
