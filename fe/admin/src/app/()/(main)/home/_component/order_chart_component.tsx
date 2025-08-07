import { Pie } from "@ant-design/plots";
import { useCountOrderByStatus } from "@state/analysis/useCountOrderByStatus";
import { Flex } from "antd";
import Title from "antd/es/typography/Title";
import React from "react";

interface OrderChartComponentProps {}

const OrderChartComponent: React.FC<OrderChartComponentProps> = ({}) => {
  const { data } = useCountOrderByStatus();

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
      <Title level={2}>Đơn hàng</Title>
      <Pie {...config} />
    </Flex>
  );
};

export default OrderChartComponent;
