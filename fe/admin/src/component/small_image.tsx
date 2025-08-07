import { Image } from 'antd';
import React from 'react';

interface SmallImageComponentProps {
    src?: string
}

const SmallImageComponent: React.FC<SmallImageComponentProps> = ({ src }) => {
    return <Image src={src} style={{
        height: "50px"
    }} />

};

export default SmallImageComponent;