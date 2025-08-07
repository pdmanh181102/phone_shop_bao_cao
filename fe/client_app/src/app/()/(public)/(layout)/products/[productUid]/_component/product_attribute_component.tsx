import { ProductAttribute } from "@/api/type/product";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Collapse, Descriptions, Empty, Flex } from "antd";
import Title from "antd/es/typography/Title";
import AttributeItemsComponent from "./attribute_items_component";

interface ProductAttributeComponentProps {
  attributes: ProductAttribute[];
}

const ProductAttributeComponent = ({
  attributes,
}: ProductAttributeComponentProps) => {
  if (!attributes || attributes.length === 0) {
    return (
      <Flex vertical gap={10}>
        <Empty description="Không có thuộc tính" />
      </Flex>
    );
  }

  // Nhóm thuộc tính
  const grouped: Record<string, ProductAttribute[]> = {};
  for (const attr of attributes) {
    const group = attr.groupName || "Khác";
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(attr);
  }

  const collapseItems = Object.entries(grouped).map(([groupName, attrs]) => ({
    key: groupName,
    label: (
      <div className="flex items-center gap-2 font-medium">
        <InfoCircleOutlined className="text-blue-500" />
        {groupName}
      </div>
    ),
    children: (
      <div className="w-full overflow-x-auto">
        <Descriptions
          column={1}
          size="small"
          layout="horizontal"
          style={{
            margin: 0,
            minWidth: 300, // đảm bảo có chiều rộng tối thiểu để không bị bóp méo
          }}
          styles={{
            label: {
              fontWeight: "500",
              width: "180px",
              color: "#555",
              background: "#fafafa",
              padding: "6px 8px",
              wordBreak: "break-word",
              whiteSpace: "normal", // cho phép xuống dòng
            },
            content: {
              maxWidth: "100%",
              color: "#222",
              padding: "6px 8px",
              wordBreak: "break-word",
              whiteSpace: "normal",
            },
          }}
        >
          {attrs.map((attr) => (
            <Descriptions.Item label={attr.name} key={attr.uid}>
              <AttributeItemsComponent attributeUid={attr.uid} />
            </Descriptions.Item>
          ))}
        </Descriptions>
      </div>
    ),
  }));

  return (
    <Flex vertical gap={16}>
      <Title level={4}>Chi tiết sản phẩm</Title>
      <Collapse
        items={collapseItems}
        defaultActiveKey={Object.keys(grouped)}
        bordered={false}
        style={{ background: "white", borderRadius: 8, overflow: "hidden" }}
      />
    </Flex>
  );
};

export default ProductAttributeComponent;
