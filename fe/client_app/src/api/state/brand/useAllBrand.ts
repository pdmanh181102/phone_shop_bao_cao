import { BrandApi } from "@/api/client/brand_api";
import { useQuery } from "@tanstack/react-query";

export const useAllBrand = () => {
    return useQuery({
        queryKey: ["brands"],
        queryFn: () => BrandApi.readAll()
    });
};
