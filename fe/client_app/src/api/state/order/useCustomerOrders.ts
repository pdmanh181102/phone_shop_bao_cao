import { CustomerApi } from "@/api/client/customer_api";
import { Order } from "@/api/type/order";
import { useQuery } from "@tanstack/react-query";

export const useCustomerOrders = (customerUid: string | null) => {
  return useQuery<Order[]>({
    queryKey: ["customer_orders", customerUid],
    enabled: !!customerUid,
    queryFn: () => {
      if (customerUid == null) return Promise.reject("customer uid is null");
      return CustomerApi.readAllOrder(customerUid);
    },
    staleTime: 0,
  });
};
