import { ProductPhotoApi } from "@/api/client/product_photo_api";
import { Page } from "@/api/type/page";
import { ProductPhoto } from "@/api/type/product";
import { useQuery } from "@tanstack/react-query";

export const useProductPhotos = (productUid: string) => {
  return useQuery<ProductPhoto[]>({
    queryKey: ["read_product_photos", productUid],
    queryFn: () => ProductPhotoApi.readAll(productUid),
    staleTime: 0,
  });
};
