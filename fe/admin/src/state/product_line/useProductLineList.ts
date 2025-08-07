import { ProductLineApi } from "@api/product_line_api";
import { ProductLine } from "@type/product_line";
import { usePaginatedQuery } from "../usePaginatedQuery";

export const useProductLineList = (brand_uid: string, {
    pagination,
    sorter,
    filters,
}: {
    pagination: { current?: number; pageSize?: number };
    sorter: { field?: string; order?: "ascend" | "descend" | null };
    filters: Record<string, any>;
}) => {
    return usePaginatedQuery<ProductLine>({
        queryKeyPrefix: "product_lines",
        pagination,
        sorter,
        filters,
        fetcher: ({
            page,
            size,
            sortField,
            sortOrder,
            filters,
        }) => ProductLineApi.readAll(brand_uid, { page, size, sortField, sortOrder })
    });
};
