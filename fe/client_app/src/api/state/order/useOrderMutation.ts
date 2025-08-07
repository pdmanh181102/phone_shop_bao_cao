import { CustomerApi } from "@/api/client/customer_api";
import { Order } from "@/api/type/order";
import { getMessageApi } from "@/context/MessageContext";
import { useMutation } from "@tanstack/react-query";

export const useOrderMutation = (onSuccess: (result: Order[]) => any) => {
  const deleteMutation = useMutation({
    mutationFn: (customerUid: string) => CustomerApi.readAllOrder(customerUid),
    onSuccess: (result: Order[]) => {
      onSuccess(result);
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "Lỗi");
    },
  });

  return { fetch: deleteMutation.mutate, loading: deleteMutation.isPending };
};
