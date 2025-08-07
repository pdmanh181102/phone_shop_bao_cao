import { ResourceApi } from "@api/resource_api";
import { useQuery } from "@tanstack/react-query";

export const useReadAllResource = () => {
    return useQuery({
        queryKey: ['resources'],
        queryFn: () => ResourceApi.readAll()
    });
};
