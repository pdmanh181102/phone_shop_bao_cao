import { useProductPhotoAvatar } from '@state/product_photo/useProductPhotoAvatar';
import { Spin } from 'antd';
import React from 'react';
import SmallImageComponent from './small_image';

interface ProductAvatarItemComponentProps {
    product_uid: string
}

const ProductAvatarItemComponent: React.FC<ProductAvatarItemComponentProps> = ({ product_uid }) => {

    const { data: photo_data, isLoading } = useProductPhotoAvatar({ product_uid });

    if (isLoading) return <Spin />

    return photo_data?.photoUrl ? <SmallImageComponent src={photo_data?.photoUrl} /> : "N/A"

};

export default ProductAvatarItemComponent;