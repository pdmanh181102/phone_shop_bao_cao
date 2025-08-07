import { useQuery } from "@tanstack/react-query";
import { Page } from "@type/page";

export interface FetcherParams {
    page?: number;
    size?: number;
    sortField?: string;
    sortOrder?: string | null;
    filters?: Record<string, any>;
}

interface UsePaginatedQueryParams<T> {
    queryKeyPrefix: string;
    fetcher: (params: FetcherParams) => Promise<Page<T>>;
    pagination?: { current?: number; pageSize?: number };
    sorter?: { field?: string; order?: "ascend" | "descend" | null };
    filters?: Record<string, any>;
}

export const usePaginatedQuery = <T>({
    queryKeyPrefix,
    fetcher,
    pagination,
    sorter,
    filters,
}: UsePaginatedQueryParams<T>) => {
    return useQuery({
        queryKey: [
            queryKeyPrefix,
            pagination?.current,
            pagination?.pageSize,
            sorter?.field,
            sorter?.order,
            filters,
        ],
        queryFn: () =>
            fetcher({
                page: pagination?.current || 1,
                size: pagination?.pageSize || 10,
                sortField: sorter?.field,
                sortOrder: sorter?.order,
                filters,
            }),
    });
};
