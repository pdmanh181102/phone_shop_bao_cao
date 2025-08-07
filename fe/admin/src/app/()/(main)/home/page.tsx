"use client";

import { Col, Flex, Row } from "antd";
import ImportChart from "./_component/import_chart";
import OrderChartComponent from "./_component/order_chart_component";
import CustomerPreviewComponent from "./_component/preview/customer_preview_component";
import OrderPreviewComponent from "./_component/preview/order_preview_component";
import ProductPreviewComponent from "./_component/preview/product_preview_component";
import UserPreviewComponent from "./_component/preview/user_preview_component";
import ProductChartComponent from "./_component/product_chart_component";
import RevenueChart from "./_component/revenue_chart";

export default function DashboardCards() {
  return (
    <Flex vertical gap={50}>
      <Row gutter={[10, 10]}>
        <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }}>
          <ProductPreviewComponent />
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }}>
          <UserPreviewComponent />
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }}>
          <CustomerPreviewComponent />
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }}>
          <OrderPreviewComponent />
        </Col>
      </Row>
      <Row gutter={[10, 10]}>
        <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }}>
          <ProductChartComponent />
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }}>
          {/* <CustomerChartComponent /> */}
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }}>
          <OrderChartComponent />
        </Col>
      </Row>
      <Row gutter={[10, 10]}>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <ImportChart />
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <RevenueChart />
        </Col>
      </Row>
    </Flex>
  );
}
