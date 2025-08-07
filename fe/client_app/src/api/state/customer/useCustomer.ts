import { CustomerApi } from "@/api/client/customer_api";
import { Customer } from "@/api/type/customer";
import { useQuery } from "@tanstack/react-query";

export const useCustomer = (customerUid: string | null) => {
  return useQuery<Customer>({
    queryKey: ["customer", customerUid],
    enabled: !!customerUid,
    queryFn: () => {
      return CustomerApi.readByUid(customerUid!); // đảm bảo customerUid đã có giá trị
    },
  });
};
