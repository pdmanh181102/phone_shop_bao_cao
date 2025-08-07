import { CartApi } from "@/api/client/cart_api";
import { getMessageApi } from "@/context/MessageContext";
import { useMutation } from "@tanstack/react-query";

export function useAddCartItem(onSuccess?: () => any) {
  const deleteMutation = useMutation({
    mutationFn: ({
      customerUid,
      productUid,
    }: {
      customerUid: string;
      productUid: string;
    }) => {
      if (!customerUid || !productUid)
        return Promise.reject("Không thể thêm sản phẩm vào giỏ hàng");
      return CartApi.addCartItem(customerUid, productUid);
    },
    onSuccess: () => {
      getMessageApi().success("Đã thêm");
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      // getMessageApi().error(error?.message || "Lỗi");
    },
  });

  return { add: deleteMutation.mutate, loading: deleteMutation.isPending };
}
