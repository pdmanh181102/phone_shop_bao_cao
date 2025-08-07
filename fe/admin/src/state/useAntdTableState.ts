import { TablePaginationConfig } from "antd/es/table";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { useCallback, useState } from "react";

export interface AntdSorter {
    field?: string;
    order?: "ascend" | "descend" | null;
}

export interface AntdTableState {
    pagination: TablePaginationConfig;
    sorter: AntdSorter;
    filters: Record<string, FilterValue | null>;
    handleTableChange: (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<any> | SorterResult<any>[]
    ) => void;
    setPagination: React.Dispatch<React.SetStateAction<TablePaginationConfig>>;
    setFilters: React.Dispatch<React.SetStateAction<Record<string, FilterValue | null>>>;
    resetTable: () => void;
}

export const useAntdTableState = (): AntdTableState => {
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['1', '10', '20', '50', '100'],
    });

    const [sorter, setSorter] = useState<AntdSorter>({
        field: undefined,
        order: null,
    });

    const [filters, setFilters] = useState<Record<string, FilterValue | null>>({});

    const handleTableChange = useCallback(
        (
            newPagination: TablePaginationConfig,
            newFilters: Record<string, FilterValue | null>,
            newSorter: SorterResult<any> | SorterResult<any>[]
        ) => {

            setPagination((prev) => ({
                ...prev,
                current: newPagination.current,
                pageSize: newPagination.pageSize,
            }));

            setFilters(newFilters);

            if (!Array.isArray(newSorter)) {
                setSorter({
                    field: newSorter.field as string,
                    order: newSorter.order,
                });
            }
        },
        []
    );

    const resetTable = () => {
        setPagination((prev) => ({ ...prev, current: 1 }));
        setFilters({});
        setSorter({ field: undefined, order: null });
    };

    return {
        pagination,
        sorter,
        filters,
        handleTableChange,
        setPagination,
        setFilters,
        resetTable,
    };
};
