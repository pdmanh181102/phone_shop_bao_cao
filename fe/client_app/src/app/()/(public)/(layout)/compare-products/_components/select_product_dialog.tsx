import { useProductList } from "@/api/state/product/useProductList";
import { useAntdTableState } from "@/api/state/useAntdTableState";
import { Product } from "@/api/type/product";
import ProductFilterComponent from "@/app/()/(public)/(layout)/products/_component/product_filter_component";
import ProductAvatarItemComponent from "@/component/product_avatar_item_component";
import { Button, Flex, Modal, Table, TableColumnsType } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import ProductFilterComponentForCompare from "./product_filter_component_for_compare";

interface FormProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: (selected_products: Product[]) => void;
}

interface FormData { }

interface FilterProps {
  search: string;
  brand_uids: string[];
  status_uids: string[];
}

const init_filter_props: FilterProps = {
  search: "",
  brand_uids: [],
  status_uids: [],
};

const AddProductDialog: React.FC<FormProps> = ({
  open,
  onCancel,
  onSuccess,
}) => {
  const [selected_row_keys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filter, setFilter] = useState<FilterProps>(init_filter_props);

  useEffect(() => {
    refetch(); // gọi lại khi filter thay đổi
  }, [filter]);

  useEffect(() => {
    if (!open) return;

    const raw = localStorage.getItem("compareProductUids");
    const uids: string[] = raw ? JSON.parse(raw) : [];
    setSelectedRowKeys(uids); // auto select
  }, [open]);
  const row_selection = {
    selectedRowKeys: selected_row_keys,
    onChange: (selected_keys: React.Key[]) => {
      setSelectedRowKeys(selected_keys);
    },
  };

  const { pagination, sorter, filters, handleTableChange, setPagination } =
    useAntdTableState();

  const {
    data: product_datas,
    isLoading,
    refetch,
  } = useProductList({
    page: pagination.current,
    search: filter.search,
    brandUid: filter.brand_uids[0],
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
        render: (_, record: Product) => (
          <ProductAvatarItemComponent product_uid={record.uid} />
        ),
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
    const selected_products: Product[] = product_datas!.content.filter((item) =>
      selected_product_uids.includes(item.uid)
    );

    // 1. Lấy danh sách hiện tại trong localStorage
    const raw = localStorage.getItem("compareProductUids");
    const current_uids: string[] = raw ? JSON.parse(raw) : [];
    // 2. Thêm những uid chưa có
    const new_uids = selected_products
      .map((p) => p.uid)
      .filter((uid) => !current_uids.includes(uid));

    const updated_uids = [...current_uids, ...new_uids];
    // 3. Cập nhật localStorage
    localStorage.setItem("compareProductUids", JSON.stringify(updated_uids));

    onSuccess(selected_products);
  };

  return (
    <Modal
      title="Thêm sản phẩm so sánh"
      open={open}
      onCancel={onCancel}
      footer={null}
      style={{
        minWidth: "500px",
        maxWidth: "100%",
      }}
      destroyOnHidden
    >
      <Flex vertical gap={30}>
        {/* Toản sửa thay ProductFilterComponent bằng ProductComponentForCompare */}
        <ProductFilterComponentForCompare
          onChange={(
            search: string,
            brand_uids: string[],
            status_uids: string[]
          ) => {
            setFilter({ search, brand_uids, status_uids });
            refetch();
            setPagination((prev) => ({
              ...prev,
              current: 1,
            }));
          }}
        />
        <Table
          pagination={pagination}
          onChange={handleTableChange}
          rowSelection={row_selection}
          scroll={{ y: 400, x: "max-content" }}
          rowKey={"uid"}
          dataSource={product_datas?.content}
          columns={columns}
          loading={isLoading}
        />

        <Flex justify="end" gap={20}>
          <Button type="primary" onClick={handleSubmit}>
            Thêm
          </Button>
          <Button onClick={onCancel}>Đóng</Button>
        </Flex>
      </Flex>
    </Modal>
  );
};

export default AddProductDialog;
