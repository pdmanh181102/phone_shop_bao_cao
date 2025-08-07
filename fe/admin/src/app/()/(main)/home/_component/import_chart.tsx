"use client";

import { DualAxes } from "@ant-design/plots";
import { useEntrySummary } from "@state/analysis/useEntrySummary";
import { DatePicker, Flex } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import Title from "antd/es/typography/Title";
import { useState } from "react";

const { RangePicker } = DatePicker;

const ImportChart = () => {
  const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);
  const { data } = useEntrySummary(
    dates[0] || undefined,
    dates[1] || undefined
  );

  const onRangeChange: RangePickerProps["onChange"] = (
    selectedDates,
    dateStrings
  ) => {
    setDates(selectedDates as [Date | null, Date | null]);
  };

  const config = {
    data,
    xField: "createdAt",
    legend: true,
    children: [
      {
        type: "line",
        yField: "totalQuantity",
        shapeField: "smooth",
        style: {
          stroke: "#5B8FF9",
          lineWidth: 2,
        },
        axis: {
          y: {
            title: "quantity",
            style: { titleFill: "#5B8FF9" },
          },
        },
      },
      {
        type: "line",
        yField: "money",
        shapeField: "smooth",
        style: {
          stroke: "#5AD8A6",
          lineWidth: 2,
        },
        axis: {
          y: {
            position: "right",
            title: "money",
            style: { titleFill: "#5AD8A6" },
            // Vẫn giữ định dạng trục Y nếu bạn muốn
            label: {
              formatter: (value: any) => {
                return new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  // minimumFractionDigits: 0,
                  // maximumFractionDigits: 0,
                }).format(value);
              },
            },
          },
        },
      },
    ],
  };
  return (
    <Flex vertical gap={10}>
      <Title level={2}>Nhập hàng & Số lượng</Title>
      <DualAxes {...config} />
      <Flex>
        <RangePicker
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          value={dates as any}
          onChange={onRangeChange}
        />
      </Flex>
    </Flex>
  );
};

export default ImportChart;
