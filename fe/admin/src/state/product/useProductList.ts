import { ProductApi } from "@api/product_api";
import { useQuery } from "@tanstack/react-query";

export const useProductList = ({
    filter,
    pagination,
    sorter,
    filters,
}: {
    pagination: { current?: number; pageSize?: number };
    sorter: { field?: string; order?: "ascend" | "descend" | null };
    filters: Record<string, any>;
    filter: {
        search: string, brand_uids: string[], status_uids: string[]
    }
}) => {


    return useQuery({
        queryKey: ["products", pagination, sorter, filter, filters],
        queryFn: () => ProductApi.readAll(
            filter,
            {
                page: pagination?.current,
                size: pagination?.pageSize,
                sortField: sorter?.field,
                sortOrder: sorter?.order
            }
        )
    });
};
