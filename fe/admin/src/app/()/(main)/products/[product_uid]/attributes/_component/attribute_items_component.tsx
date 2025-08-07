import LoadingScreen from "@component/loading_screen";
import { useProductAttributeItemList } from "@state/product_attribute/useProductAttributeItemList";
import { Flex, Tag } from "antd";
import React from "react";

interface AttributeItemComponentProps {
  attributeUid: string;
}

const AttributeItemsComponent: React.FC<AttributeItemComponentProps> = ({
  attributeUid,
}) => {
  const { data, isLoading } = useProductAttributeItemList(attributeUid);

  if (isLoading) return <LoadingScreen />;

  return (
    <Flex vertical gap={10}>
      {data &&
        data.map((item) => (
          <Flex key={item.uid}>
            <Tag color="blue" style={{ fontSize: 13, wordBreak: "break-word" }}>
              {item.value}
            </Tag>
          </Flex>
        ))}
    </Flex>
  );
};

export default AttributeItemsComponent;
