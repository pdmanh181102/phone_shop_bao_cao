import { CartApi } from "@/api/client/cart_api";
import { getMessageApi } from "@/context/MessageContext";
import { useMutation } from "@tanstack/react-query";

export function useRemoveCartItem(onSuccess?: () => any) {
  const deleteMutation = useMutation({
    mutationFn: ({
      customerUid,
      productUid,
    }: {
      customerUid: string;
      productUid: string;
    }) => CartApi.removeCartItem(customerUid, productUid),
    onSuccess: () => {
      getMessageApi().success("Đã xóa");
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "Lỗi");
    },
  });

  return { remove: deleteMutation.mutate, loading: deleteMutation.isPending };
}
