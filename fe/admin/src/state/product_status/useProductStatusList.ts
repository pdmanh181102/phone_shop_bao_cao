import { ProductStatusApi } from "@api/product_status_api";
import { useQuery } from "@tanstack/react-query";

export const useProductStatusList = () => {
    return useQuery({
        queryKey: ["product_status"],
        queryFn: () => ProductStatusApi.readAll()
    });
};
