import { ProductPhotoApi } from "@api/product_photo_api";
import { useQuery } from "@tanstack/react-query";
import { ProductPhoto } from "@type/product_photo";

export const useProductPhotoAvatar = ({ product_uid }: { product_uid: string }) => {
    return useQuery<ProductPhoto>({
        queryKey: ['read_product_avatar', product_uid],
        queryFn: () => ProductPhotoApi.readProductAvatar(product_uid),
        staleTime: 0,
    });
};
