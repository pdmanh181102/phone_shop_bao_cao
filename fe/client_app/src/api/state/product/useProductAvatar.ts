import { ProductPhotoApi } from "@/api/client/product_photo_api";
import { ProductPhoto } from "@/api/type/product";
import { useQuery } from "@tanstack/react-query";

export const useProductAvatar = (productUid: string) => {
  return useQuery<ProductPhoto>({
    queryKey: ["read_product_avatar", productUid],
    queryFn: () => ProductPhotoApi.readProductAvatar(productUid),
    staleTime: 0,
  });
};
