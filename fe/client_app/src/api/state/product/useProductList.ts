import { ProductApi, ReadAllProductParams } from "@/api/client/product_api";
import { useQuery } from "@tanstack/react-query";

export const useProductList = ({
  page,
  search,
  brandUid,
}: ReadAllProductParams) => {
  return useQuery({
    queryKey: ["products", page, search, brandUid],
    queryFn: () => ProductApi.readAll({ page, search, brandUid }),
  });
};
