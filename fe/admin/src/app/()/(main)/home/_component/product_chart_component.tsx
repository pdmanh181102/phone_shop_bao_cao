import { Pie } from "@ant-design/plots";
import { useCountProductByStatus } from "@state/analysis/useCountProductByStatus";
import { Flex } from "antd";
import Title from "antd/es/typography/Title";
import React from "react";

interface ProductChartComponentProps {}

const ProductChartComponent: React.FC<ProductChartComponentProps> = ({}) => {
  const { data } = useCountProductByStatus();

  const config = {
    data,
    angleField: "value",
    colorField: "type",
    radius: 1,
    label: {
      type: "spider", // hoặc "outer" hoặc bỏ luôn nếu không cần
      content: "{name} ({percentage})",
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
    height: 300,
    autoFit: true,
  };

  return (
    <Flex vertical>
      <Title level={2}>Sản phẩm</Title>
      <Pie {...config} />
    </Flex>
  );
};

export default ProductChartComponent;
