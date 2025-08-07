import { BrandApi } from "@/api/brand_api";
import { Brand } from "@type/brand";
import { usePaginatedQuery } from "../usePaginatedQuery";

export const useBrandList = ({
    pagination,
    sorter,
    filters,
}: {
    pagination: { current?: number; pageSize?: number };
    sorter: { field?: string; order?: "ascend" | "descend" | null };
    filters: Record<string, any>;
}) => {
    return usePaginatedQuery<Brand>({
        queryKeyPrefix: "brands",
        pagination,
        sorter,
        filters,
        fetcher: ({
            page,
            size,
            sortField,
            sortOrder,
            filters,
        }) => BrandApi.readAll({ page, size, sortField, sortOrder })
    });
};
