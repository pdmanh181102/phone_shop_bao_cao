import { BrandApi } from "@/api/brand_api";
import { useQuery } from "@tanstack/react-query";

export const useAllBrand = () => {
    return useQuery({
        queryKey: ['brands'],
        queryFn: () => BrandApi.readAll({})
    });
};
