// src/api/state/product/useProductReviews.ts
import { ReviewApi } from "@api/review_api";
import { useQuery } from "@tanstack/react-query";
import { Review } from "@type/review";

export const useProductReviews = (productUid: string) =>
    useQuery<Review[]>({
        queryKey: ["product_reviews", productUid],
        queryFn: () => ReviewApi.getAllByProduct(productUid),
        enabled: !!productUid,
    });