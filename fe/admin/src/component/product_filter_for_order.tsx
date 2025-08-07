import { useBrandList } from '@state/brand/useBrandList';
import { Col, Flex, Input, Row, Select, SelectProps } from 'antd';
import Title from 'antd/es/typography/Title';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface ProductFilterForOrderComponentProps {
    onChange: (search: string, brand_uids: string[]) => void,
}

const ProductFilterForOrderComponent: React.FC<ProductFilterForOrderComponentProps> = ({ onChange }) => {

    const [search, setSearch] = useState<string>("");
    const [selected_brand_uids, setSelectedBrandUids] = useState<string[]>([]);

    const { data: brandDatas } = useBrandList({
        pagination: {},
        sorter: { field: "name", order: "ascend" },
        filters: {}
    });

    const brand_options: SelectProps<string>['options'] = useMemo(() => brandDatas?.content?.map(item => ({ label: item.name, value: item.uid })), [brandDatas])

    const searchDebounce = useCallback(debounce((value: string) => { setSearch(value.trim()) }, 500), [])

    useEffect(() => {
        onChange(search, selected_brand_uids)
    }, [search, selected_brand_uids]);


    return <Flex vertical gap={10}>
        <Row gutter={10}>
            <Col md={{ span: 24 }} xl={{ span: 24 / 2 }}>
                <Flex vertical gap={10}>
                    <Title level={5}>Tìm kiếm</Title>
                    <Input placeholder='search' onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value.trim();
                        searchDebounce(value)
                    }} />
                </Flex>
            </Col>
            <Col md={{ span: 24 }} xl={{ span: 24 / 2 }}>
                <Flex vertical gap={10}>
                    <Title level={5}>Thương hiệu</Title>
                    <Select<string[]> style={{ width: "100%" }} mode="multiple" options={brand_options} placeholder="Thương hiệu" value={selected_brand_uids} showSearch onChange={(value: string[]) => {
                        setSelectedBrandUids(value);
                    }} />
                </Flex>
            </Col>
        </Row>


    </Flex>
};

export default ProductFilterForOrderComponent;