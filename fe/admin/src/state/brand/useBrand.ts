import { BrandApi } from "@/api/brand_api";
import { useQuery } from "@tanstack/react-query";

export const useBrand = ({ brand_uid }: { brand_uid: string }) => {
    return useQuery({
        queryKey: ['brand', brand_uid],
        queryFn: () => BrandApi.readByUid(brand_uid)
    });
};
