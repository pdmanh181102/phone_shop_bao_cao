import { Flex } from 'antd';
import React from 'react';
import CreateInventoryAdjustmentBodyTemplate from './_templates/body_template';
import CreateInventoryAdjustmentHeaderTemplate from './_templates/header_template';

interface CreateInventoryAdjustmentPageProps {
}

const CreateInventoryAdjustmentPage: React.FC<CreateInventoryAdjustmentPageProps> = ({ }) => {
    return <Flex vertical gap={20}>
        <CreateInventoryAdjustmentHeaderTemplate />
        <CreateInventoryAdjustmentBodyTemplate />
    </Flex>

};

export default CreateInventoryAdjustmentPage;