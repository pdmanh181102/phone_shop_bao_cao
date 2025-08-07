import { Pie } from "@ant-design/plots";
import { Flex } from "antd";
import Title from "antd/es/typography/Title";
import React from "react";

interface UserChartComponentProps {}

const UserChartComponent: React.FC<UserChartComponentProps> = ({}) => {
  const data = [
    { type: "Active", value: 27 },
    { type: "Disable", value: 25 },
  ];

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
      <Title level={2}>Nhân viên</Title>
      <Pie {...config} />
    </Flex>
  );
};

export default UserChartComponent;
