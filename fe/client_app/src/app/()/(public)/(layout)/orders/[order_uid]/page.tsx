import { Col, Flex, Row } from "antd";
import React from "react";
import OrderDetailBodyTemplate from "./_template/body_template";
import OrderDetailHeaderTemplate from "./_template/header_template";

interface OrderDetailPageProps {
  params: Promise<{
    order_uid: string;
  }>;
}

const OrderDetailPage: React.FC<OrderDetailPageProps> = async ({ params }) => {
  const { order_uid } = await params;
  return (
    <Row justify={"center"}>
      <Col sm={{ span: 23 }} md={{ span: 20 }}>
        <Flex vertical gap={20}>
          <OrderDetailHeaderTemplate order_uid={order_uid} />
          <OrderDetailBodyTemplate order_uid={order_uid} />
        </Flex>
      </Col>
    </Row>
  );
};

export default OrderDetailPage;
