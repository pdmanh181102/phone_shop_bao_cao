import { CartApi } from "@/api/client/cart_api";
import { Product } from "@/api/type/product";
import { getMessageApi } from "@/context/MessageContext";
import { useMutation } from "@tanstack/react-query";

export const useCartItemsMutate = (onSuccess: (result: Product[]) => any) => {
  const deleteMutation = useMutation({
    mutationFn: (customerUid: string) => CartApi.readAllProduct(customerUid),
    onSuccess: (result: Product[]) => {
      onSuccess(result);
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "Lỗi");
    },
  });

  return { fetch: deleteMutation.mutate, loading: deleteMutation.isPending };
};
