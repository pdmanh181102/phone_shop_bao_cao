import { useProductAttributeList } from "@state/product_attribute/useProductAttributeList";
import { ProductAttribute } from "@type/product.attribute";
import { Collapse, Descriptions, Empty, Flex, Spin } from "antd";
import React, { useMemo } from "react";
import AttributeItemsComponent from "../attributes/_component/attribute_items_component";

interface ProductAttributeComponentProps {
  product_uid: string;
}

const ProductAttributeComponent: React.FC<ProductAttributeComponentProps> = ({
  product_uid,
}) => {
  const { data, isLoading } = useProductAttributeList(product_uid);

  const productAttributeData = data?.content || [];

  const grouped = useMemo(() => {
    if (!productAttributeData) return {};
    return productAttributeData.reduce<Record<string, ProductAttribute[]>>(
      (acc, attr) => {
        const group = attr.groupName || "Khác";
        if (!acc[group]) acc[group] = [];
        acc[group].push(attr);
        return acc;
      },
      {}
    );
  }, [productAttributeData]);

  const collapseItems = Object.entries(grouped).map(([groupName, attrs]) => ({
    key: groupName,
    label: groupName,
    children: (
      <Descriptions
        column={1}
        size="small"
        layout="horizontal"
        styles={{
          label: { fontWeight: "bold", width: "150px" },
          content: { maxWidth: "400px" },
        }}
      >
        {attrs.map((attr) => (
          <Descriptions.Item label={attr.name} key={attr.uid}>
            <AttributeItemsComponent attributeUid={attr.uid} />
          </Descriptions.Item>
        ))}
      </Descriptions>
    ),
  }));

  return (
    <Flex vertical gap={10}>
      {isLoading ? (
        <Spin />
      ) : !productAttributeData || productAttributeData.length === 0 ? (
        <Empty description="Không có thuộc tính" />
      ) : (
        <Collapse items={collapseItems} />
      )}
    </Flex>
  );
};

export default ProductAttributeComponent;
