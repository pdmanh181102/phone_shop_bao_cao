import { Flex } from "antd";
import React from "react";

import { Card, Col, Row } from "antd";
import { Meta } from "antd/es/list/Item";
import Title from "antd/es/typography/Title";

const cardData = [
  { label: "Sản phẩm", value: 100 },
  { label: "Nhân viên", value: 100 },
  { label: "Khách hàng", value: 100 },
  { label: "Đơn hàng", value: 100 },
];

const cardColors = [
  { backgroundColor: "#e0f7fa", color: "#00796b" },
  { backgroundColor: "#fce4ec", color: "#c2185b" },
  { backgroundColor: "#e8f5e9", color: "#2e7d32" },
  { backgroundColor: "#fff8e1", color: "#f9a825" },
];

interface PreviewComponentProps {}

const PreviewComponent: React.FC<PreviewComponentProps> = ({}) => {
  return (
    <Flex vertical gap={10}>
      <Row gutter={[10, 10]}>
        {cardData.map((item, index) => (
          <Col
            key={item.label}
            xs={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 6 }}
          >
            <Card
              style={{
                backgroundColor:
                  cardColors[index % cardColors.length].backgroundColor,
                color: cardColors[index % cardColors.length].color,
              }}
              styles={{ body: { padding: 16 } }}
            >
              <Meta
                title={
                  <Flex
                    vertical
                    style={{
                      color: cardColors[index % cardColors.length].color,
                    }}
                  >
                    <Title level={4} style={{ margin: 0 }}>
                      {item.label}
                    </Title>
                    <Title level={2} style={{ margin: 0 }}>
                      {item.value}
                    </Title>
                  </Flex>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </Flex>
  );
};

export default PreviewComponent;
