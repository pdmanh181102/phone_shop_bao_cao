import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps } from "antd";
import React from "react";

interface DropDownMenuCompoentProps {
  items: MenuProps["items"];
  text?: string;
}

const DropDownMenuComponent: React.FC<DropDownMenuCompoentProps> = ({
  items,
  text,
}) => {
  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <Button size="small" variant="solid" color="blue">
        {text || "Tùy chọn"} <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default DropDownMenuComponent;
