import { Flex } from "antd";
import React from "react";
import FooterTemplate from "./_component/footer_template";
import TemplateHeader from "./_component/header_template";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Flex vertical gap={20} justify="center">
      <TemplateHeader />
      {children}
      <FooterTemplate />
    </Flex>
  );
}
