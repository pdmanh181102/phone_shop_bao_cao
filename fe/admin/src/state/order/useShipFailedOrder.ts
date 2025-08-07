import { OrderApi } from "@api/order_api";
import { getMessageApi } from "@context/MessageContext";
import { useMutation } from "@tanstack/react-query";

export function useShipFailedOrder(onSuccess: () => void) {
  const updateNameMutation = useMutation({
    mutationFn: ({ order_uid }: { order_uid: string }) =>
      OrderApi.updateStatus(order_uid, "GIAO_HANG_THAT_BAI"),
    onSuccess: () => {
      getMessageApi().success("Đã cập nhật");
      onSuccess();
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "Lỗi");
    },
  });

  return {
    shipFailedOrder: updateNameMutation.mutate,
    loading: updateNameMutation.isPending,
  };
}
