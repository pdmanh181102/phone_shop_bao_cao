import { OrderApi } from "@/api/client/order_api";
import { getMessageApi } from "@/context/MessageContext";
import { useMutation } from "@tanstack/react-query";

export function useCancleOrder(onSuccess: () => void) {
  const updateNameMutation = useMutation({
    mutationFn: (orderUid: string) => OrderApi.updateStatus(orderUid, "DA_HUY"),
    onSuccess: () => {
      getMessageApi().success("Đã cập nhật");
      onSuccess();
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "Lỗi");
    },
  });

  return {
    cancleOrder: updateNameMutation.mutate,
    loading: updateNameMutation.isPending,
  };
}
