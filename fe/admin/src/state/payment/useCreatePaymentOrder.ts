import { PaymentApi } from "@api/payment_api";
import { getMessageApi } from "@context/MessageContext";
import { getZaloPayRedirectUrl } from "@lib/axios.c";
import { useMutation } from "@tanstack/react-query";

export function useCreatePaymentOrder(onSuccess: () => void) {
  const createMutation = useMutation({
    mutationFn: async ({ order_uid }: { order_uid: string }) => {
      const redirectUrl = `${await getZaloPayRedirectUrl()}/payment-redirect/${order_uid}`;
      return PaymentApi.createPaymentOrder(order_uid, redirectUrl);
    },
    onSuccess: (result) => {
      console.log(result);
      const { type } = result;
      if (type == 1) {
        onSuccess();
        return;
      }
      const { orderUrl } = result;
      window.location.href = orderUrl;
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "Lỗi");
    },
  });

  return { create: createMutation.mutate, loading: createMutation.isPending };
}
