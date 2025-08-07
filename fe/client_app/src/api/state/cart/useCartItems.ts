import { CartApi } from "@/api/client/cart_api";
import { Product } from "@/api/type/product";
import { useQuery } from "@tanstack/react-query";

export const useCartItems = (customerUid: string | null) => {
  return useQuery<Product[]>({
    queryKey: ["cart", customerUid],
    enabled: !!customerUid,
    queryFn: () => {
      if (customerUid == null) return Promise.reject("customer uid is null");
      return CartApi.readAllProduct(customerUid);
    },
    staleTime: 0,
  });
};
