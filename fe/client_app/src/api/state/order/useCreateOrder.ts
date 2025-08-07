import { OrderApi } from "@/api/client/order_api";
import { getMessageApi } from "@/context/MessageContext";
import { useMutation } from "@tanstack/react-query";

export function useCreateOrder(onSuccess: () => void) {
  const createMutation = useMutation({
    mutationFn: ({
      note,
      address,
      recipientName,
      recipientPhone,
      paymentMethod,

      items,
    }: {
      note: string;
      address: string;
      recipientName: string;
      recipientPhone: string;
      paymentMethod: string;
      items: {
        productUid: string;
        quantity: number;
      }[];
    }) =>
      OrderApi.create({
        note,
        address,
        recipientName,
        recipientPhone,
        paymentMethod,
        shippingAmount: null,
        items,
      }),
    onSuccess: (result) => {
      onSuccess();
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "lỗi");
    },
  });

  return { create: createMutation.mutate, loading: createMutation.isPending };
}
