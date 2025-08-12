import { CustomerApi } from "@api/customer_api";
import { useQuery } from "@tanstack/react-query";

export const useAllCustomer = () => {
    return useQuery({
        queryKey: ['customers'],
        queryFn: () => CustomerApi.readAll({})
    });
};
