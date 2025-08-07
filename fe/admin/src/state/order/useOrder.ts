import { OrderApi } from "@api/order_api";
import { useQuery } from "@tanstack/react-query";

export const useOrder = ({ order_uid }: { order_uid: string }) => {
    return useQuery({
        queryKey: ['order', order_uid],
        queryFn: () => OrderApi.readByUid(order_uid)
    });
};
