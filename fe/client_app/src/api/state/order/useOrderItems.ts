import { OrderApi } from "@/api/client/order_api";
import { useQuery } from "@tanstack/react-query";

export const useOrderItems = (orderUid: string) => {
  return useQuery({
    queryKey: ["order_items", orderUid],
    queryFn: () => OrderApi.readAllItems(orderUid),
  });
};
