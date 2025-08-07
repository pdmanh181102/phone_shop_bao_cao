import LoadingScreen from '@component/loading_screen';
import { useProductProductLineList } from '@state/product/useProductProductLineList';
import { Button, Flex } from 'antd';
import { _ButtonColorTypes } from 'antd/es/button';
import React from 'react';

interface ProductProductLinesComponentProps {
    product_uid: string
}

const ProductProductLinesComponent: React.FC<ProductProductLinesComponentProps> = ({ product_uid }) => {

    const { data, isLoading } = useProductProductLineList(product_uid, true);

    if (isLoading) return <LoadingScreen />

    return <Flex gap={10} wrap>
        {data && data.content.map((line, index) => <Button type='text' variant='solid' color={_ButtonColorTypes[index]} key={line.uid}>{line.name}</Button>)}
    </Flex>

};

export default ProductProductLinesComponent;