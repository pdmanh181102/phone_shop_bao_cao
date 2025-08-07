"use client";

import { formatCurrencyVND } from "@/uitl/format_util";
import { Column } from "@ant-design/plots";
import { useOrderSummary } from "@state/analysis/useOrderSummary";
import { DatePicker, Flex } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import Title from "antd/es/typography/Title";
import { useState } from "react";

const { RangePicker } = DatePicker;

const RevenueChart = () => {
  const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);
  const { data } = useOrderSummary(
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
    yField: "money",
    color: "#5AD8A6",
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    label: {
      position: "top",
      formatter: (value: any) => formatCurrencyVND(value),
    },
    yAxis: {},
  };

  return (
    <Flex vertical gap={10}>
      <Title level={2}>Giá trị đơn hàng</Title>
      <Column {...config} />
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

export default RevenueChart;
