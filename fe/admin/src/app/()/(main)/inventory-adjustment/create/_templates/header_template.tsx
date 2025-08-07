import { Breadcrumb } from 'antd';
import Link from 'antd/es/typography/Link';
import React from 'react';

interface CreateInventoryAdjustmentHeaderTemplateProps {
}

const CreateInventoryAdjustmentHeaderTemplate: React.FC<CreateInventoryAdjustmentHeaderTemplateProps> = ({ }) => {
    return <Breadcrumb items={[
        {
            title: <Link href="/home">Home</Link>,
        },
        {
            title: <Link href="/inventory-adjustment">Điều chỉnh tồn kho</Link>,
        },
        {
            title: "Tạo phiếu"
        }
    ]} />

};

export default CreateInventoryAdjustmentHeaderTemplate;