import { ProductPhotoApi } from "@api/product_photo_api";
import { useQuery } from "@tanstack/react-query";
import { Page } from "@type/page";
import { ProductPhoto } from "@type/product_photo";

export const useProductPhotoList = (product_uid: string) => {
    return useQuery<Page<ProductPhoto>>({
        queryKey: ['read_product_avatar', product_uid],
        queryFn: () => ProductPhotoApi.readAll(product_uid),
        staleTime: 0,
    });
};
