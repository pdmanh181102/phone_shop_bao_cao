import { OrderApi } from "@api/order_api";
import { getMessageApi } from "@context/MessageContext";
import { useMutation } from "@tanstack/react-query";

export function useRefundOrder(onSuccess: () => void) {
  const updateNameMutation = useMutation({
    mutationFn: ({ order_uid }: { order_uid: string }) =>
      OrderApi.updateStatus(order_uid, "DA_HOAN_TIEN"),
    onSuccess: () => {
      getMessageApi().success("Đã cập nhật");
      onSuccess();
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "Lỗi");
    },
  });

  return {
    refundOrder: updateNameMutation.mutate,
    loading: updateNameMutation.isPending,
  };
}
