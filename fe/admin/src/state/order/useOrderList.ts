import { OrderApi } from "@api/order_api";
import { Order } from "@type/order";
import { usePaginatedQuery } from "../usePaginatedQuery";

export const useOrderList = ({
    pagination,
    sorter,
    filters,
}: {
    pagination: { current?: number; pageSize?: number };
    sorter: { field?: string; order?: "ascend" | "descend" | null };
    filters: Record<string, any>;
}) => {
    return usePaginatedQuery<Order>({
        queryKeyPrefix: "orders",
        pagination,
        sorter,
        filters,
        fetcher: ({
            page,
            size,
            sortField,
            sortOrder,
            filters,
        }) => OrderApi.readAll({ page, size, sortField, sortOrder })
    });
};
