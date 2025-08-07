import { OrderApi } from "@/api/client/order_api";
import { Order } from "@/api/type/order";
import { useQuery } from "@tanstack/react-query";

export const useOrder = (orderUid: string) => {
  return useQuery<Order>({
    queryKey: ["order", orderUid],
    queryFn: () => OrderApi.readByUid(orderUid),
    staleTime: 0,
  });
};
