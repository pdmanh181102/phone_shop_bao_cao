"use client";

import { Flex, Spin } from "antd";
import React from "react";

interface LoadingScreenProps {}

const LoadingScreen: React.FC<LoadingScreenProps> = ({}) => {
  return (
    <Flex
      style={{
        width: "100%",
        height: "100%",
      }}
      justify="center"
      align="center"
    >
      <Spin></Spin>
    </Flex>
  );
};

export default LoadingScreen;
