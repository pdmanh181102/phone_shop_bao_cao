// src/api/state/product/useProductReviews.ts
import { ReviewApi } from "@/api/client/review_api";
import { Review } from "@/api/type/review";
import { useQuery } from "@tanstack/react-query";

export const useProductReviews = (productUid: string) =>
    useQuery<Review[]>({
        queryKey: ["product_reviews", productUid],
        queryFn: () => ReviewApi.getAllByProduct(productUid),
        enabled: !!productUid,
    });