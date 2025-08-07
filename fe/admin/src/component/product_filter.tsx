import { useBrandList } from "@state/brand/useBrandList";
import { useProductStatusList } from "@state/product_status/useProductStatusList";
import { Col, Flex, Input, Row, Select, SelectProps } from "antd";
import Title from "antd/es/typography/Title";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";

interface ProductFilterComponentProps {
  onChange: (
    search: string,
    brand_uids: string[],
    status_uids: string[]
  ) => void;
}

const ProductFilterComponent: React.FC<ProductFilterComponentProps> = ({
  onChange,
}) => {
  const [search, setSearch] = useState<string>("");
  const [searchText, setSearchText] = useState("");
  const [selected_brand_uids, setSelectedBrandUids] = useState<string[]>([]);
  const [selected_status_uids, setSelectedStatusUids] = useState<string[]>([]);

  const {
    data: brandDatas,
    isFetching: fetchingBrandDatas,
    refetch: refetchBrandDatas,
  } = useBrandList({
    pagination: {},
    sorter: { field: "name", order: "ascend" },
    filters: {},
  });

  const {
    data: productStatusDatas,
    isFetching: fetchingProductStatusDatas,
    refetch: refetchProductStatusDatas,
  } = useProductStatusList();

  const brand_options: SelectProps<string>["options"] = useMemo(
    () =>
      brandDatas?.content?.map((item) => ({
        label: item.name,
        value: item.uid,
      })),
    [brandDatas]
  );

  const status_options: SelectProps<string>["options"] = useMemo(
    () =>
      productStatusDatas?.map((item) => ({
        label: item.label,
        value: item.uid,
      })),
    [productStatusDatas]
  );

  const searchDebounce = useCallback(
    debounce((value: string) => {
      setSearch(value.trim());
    }, 500),
    []
  );

  useEffect(() => {
    onChange(search, selected_brand_uids, selected_status_uids);
  }, [search, selected_brand_uids, selected_status_uids]);

  return (
    <Flex vertical gap={10}>
      <Row gutter={10}>
        <Col xs={{ span: 24 }} md={{ span: 12 }} xl={{ span: 8 }}>
          <Flex vertical gap={10}>
            <Title level={5}>Thương hiệu</Title>
            <Select<string[]>
              loading={fetchingBrandDatas}
              style={{ width: "100%" }}
              mode="multiple"
              options={brand_options}
              placeholder="Thương hiệu"
              value={selected_brand_uids}
              showSearch
              onChange={(value: string[]) => {
                setSelectedBrandUids(value);
              }}
            />
          </Flex>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 12 }} xl={{ span: 8 }}>
          <Flex vertical gap={10}>
            <Title level={5}>Trạng thái</Title>
            <Select<string[]>
              loading={fetchingProductStatusDatas}
              style={{ width: "100%" }}
              mode="multiple"
              options={status_options}
              placeholder="Trạng thái"
              value={selected_status_uids}
              showSearch
              onChange={(value: string[]) => {
                setSelectedStatusUids(value);
              }}
            />
          </Flex>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 12 }} xl={{ span: 8 }}>
          <Flex vertical gap={10}>
            <Title level={5}>Tìm kiếm</Title>
            <Input
              value={searchText}
              placeholder="Tìm kiếm..."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                setSearchText(value);
                searchDebounce(value.trim());
              }}
              prefix={<FiSearch className="text-gray-400" />}
              suffix={
                searchText ? (
                  <AiOutlineClose
                    onClick={() => {
                      setSearchText("");
                      searchDebounce("");
                    }}
                    className="cursor-pointer text-gray-400 hover:text-red-500"
                  />
                ) : null
              }
            />
          </Flex>
        </Col>
      </Row>
    </Flex>
  );
};

export default ProductFilterComponent;
