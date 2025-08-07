import { PaymentMethodApi } from "@api/payment_method_api";
import { useQuery } from "@tanstack/react-query";

export const usePaymentMethodList = () => {
    return useQuery({
        queryKey: ["payment_methods"],
        queryFn: () => PaymentMethodApi.readAll()
    });
};
