import { useCountAllOrder } from "@state/analysis/useCountAllOrder";
import { Card, Flex } from "antd";
import Meta from "antd/es/card/Meta";
import Title from "antd/es/typography/Title";
import React from "react";

interface OrderPreviewComponentProps {}

const cardColors = [
  { backgroundColor: "#e0f7fa", color: "#00796b" },
  { backgroundColor: "#fce4ec", color: "#c2185b" },
  { backgroundColor: "#e8f5e9", color: "#2e7d32" },
  { backgroundColor: "#fff8e1", color: "#f9a825" },
];

const colorIndex = 3;

const OrderPreviewComponent: React.FC<OrderPreviewComponentProps> = ({}) => {
  const { data } = useCountAllOrder();

  return (
    <Card
      style={{
        backgroundColor: cardColors[colorIndex].backgroundColor,
        color: cardColors[colorIndex].color,
      }}
      styles={{ body: { padding: 16 } }}
    >
      <Meta
        title={
          <Flex
            vertical
            style={{
              color: cardColors[colorIndex].color,
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              Đơn hàng
            </Title>
            <Title level={2} style={{ margin: 0 }}>
              {data}
            </Title>
          </Flex>
        }
      />
    </Card>
  );
};

export default OrderPreviewComponent;
