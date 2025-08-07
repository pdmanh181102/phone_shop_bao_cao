import { OrderApi } from "@api/order_api";
import { useQuery } from "@tanstack/react-query";

export const useOrderItems = ({ order_uid }: { order_uid: string }) => {
    return useQuery({
        queryKey: ['order_items', order_uid],
        queryFn: () => OrderApi.readAllItems(order_uid)
    });
};
