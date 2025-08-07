import { getCurrentProductQuantity } from "@/uitl/extract_util";
import { useProductList } from "@state/product/useProductList";
import { useAntdTableState } from "@state/useAntdTableState";
import { Product } from "@type/product";
import { Button, Flex, Modal, Table, TableColumnsType } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import ProductAvatarItemComponent from "./product_avatar_item_component";
import ProductFilterForOrderComponent from "./product_filter_for_order";

interface FormProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: (selected_products: Product[]) => void;
}

interface FormData {
}

interface FilterProps {
    search: string, brand_uids: string[], status_uids: string[]
}

const init_filter_props: FilterProps = {
    search: "",
    brand_uids: [],
    status_uids: []
}

const SelectOrderProduct: React.FC<FormProps> = ({ open, onCancel, onSuccess }) => {

    const [selected_row_keys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const row_selection = {
        selectedRowKeys: selected_row_keys,
        onChange: (selected_keys: React.Key[]) => {
            setSelectedRowKeys(selected_keys);
        },
        getCheckboxProps: (record: Product) => ({
            disabled: getCurrentProductQuantity(record) == "0"
        }),
    };

    const [filter, setFilter] = useState<FilterProps>(init_filter_props);

    const {
        pagination,
        sorter,
        filters,
        handleTableChange,
        setPagination,
    } = useAntdTableState();

    const { data: product_datas, isLoading, refetch } = useProductList({
        filter,
        pagination,
        sorter,
        filters,
    });

    useEffect(() => {
        if (product_datas?.totalElements) {
            setPagination((prev) => ({
                ...prev,
                total: product_datas.totalElements,
            }));
        }
    }, [product_datas?.totalElements]);

    const columns: TableColumnsType<Product> = useMemo(
        () => [

            {
                title: "Tên sản phẩm",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Hình ảnh",
                key: "avatar",
                render: (_, record: Product) => (<ProductAvatarItemComponent product_uid={record.uid} />)
            },
            {
                title: "Trạng thái",
                dataIndex: "status",
                key: "status",
            },
        ],
        []
    );

    const handleSubmit = () => {
        const selected_product_uids = selected_row_keys as string[];
        const selected_products: Product[] = product_datas!.content.filter(item => selected_product_uids.includes(item.uid));
        onSuccess(selected_products);
    }

    return (
        <Modal title="Thêm sản phẩm" open={open} onCancel={onCancel} footer={null} style={{
            width: "100%"
        }} destroyOnHidden>
            <Flex vertical gap={30}>
                <ProductFilterForOrderComponent onChange={(search: string, brand_uids: string[]) => {
                    setFilter({ search, brand_uids, status_uids: ['ACTIVE'] });
                }} />
                <Table
                    pagination={pagination}
                    onChange={handleTableChange} rowSelection={row_selection} scroll={{ y: 400, x: 'max-content' }} rowKey={"uid"} dataSource={product_datas?.content} columns={columns} loading={isLoading} />

                <Flex justify="end" gap={20}>
                    <Button type="primary" onClick={handleSubmit}>Thêm</Button>
                    <Button onClick={onCancel}>Đóng</Button>
                </Flex>
            </Flex>

        </Modal>
    );
};

export default SelectOrderProduct;