import { CustomerApi } from "@api/customer_api";
import { useQuery } from "@tanstack/react-query";
import { Customer } from "@type/customer";

export const useCustomer = (customerUid: string | null) => {
  return useQuery<Customer>({
    queryKey: ["customer", customerUid],
    enabled: !!customerUid,
    queryFn: () => {
      return CustomerApi.readByUid(customerUid!); // đảm bảo customerUid đã có giá trị
    },
  });
};
