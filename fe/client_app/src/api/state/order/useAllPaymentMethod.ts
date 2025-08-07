import { PaymentMethodApi } from "@/api/client/payment_method_api";
import { useQuery } from "@tanstack/react-query";

export const useAllPaymentMethod = () => {
  return useQuery({
    queryKey: ["payment_methods"],
    queryFn: () => PaymentMethodApi.readAll(),
  });
};
