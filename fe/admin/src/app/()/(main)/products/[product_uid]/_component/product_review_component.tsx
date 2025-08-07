"use client";

import { useProductReviews } from "@state/product/useProductReviews";
import {
  Card,
  Flex,
  Pagination,
  Radio,
  Rate,
  Select,
  Skeleton,
  Space,
  Typography,
} from "antd";
import { useMemo, useState } from "react";

const { Title, Text } = Typography;
const { Option } = Select;

interface Props {
  productUid: string;
}

const PAGE_SIZE = 5;

const ProductReviewListComponent: React.FC<Props> = ({ productUid }) => {
  // 🧠 KHÔNG đặt Hook trong if/return
  const { data: reviews, isPending } = useProductReviews(productUid);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState<"newest" | "highestStar">("newest");
  const [starFilter, setStarFilter] = useState<number | null>(null);

  // 👉 Lọc theo sao
  const filteredReviews = useMemo(() => {
    if (!reviews) return [];
    return starFilter ? reviews.filter((r) => r.star === starFilter) : reviews;
  }, [reviews, starFilter]);

  // 👉 Sắp xếp
  const sortedReviews = useMemo(() => {
    return [...filteredReviews].sort((a, b) => {
      if (sortType === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortType === "highestStar") {
        return b.star - a.star;
      }
      //sao thấp nhất
      if (sortType === "lowestStar") {
        return a.star - b.star; // Sắp xếp sao thấp nhất
      }
      return 0;
    });
  }, [filteredReviews, sortType]);

  // 👉 Phân trang
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const paginatedReviews = sortedReviews.slice(startIdx, startIdx + PAGE_SIZE);

  // 👉 Nội dung hiển thị chính
  let content: React.ReactNode;

  if (isPending) {
    content = <Skeleton active paragraph={{ rows: 4 }} />;
  } else if (!reviews || reviews.length === 0) {
    content = <Text type="secondary">Chưa có đánh giá nào</Text>;
  } else {
    content = (
      <>
        <Flex justify="space-between" wrap="wrap" gap={16}>
          <Space>
            <Text strong>Lọc theo sao:</Text>
            <Radio.Group
              value={starFilter}
              onChange={(e) => {
                setStarFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <Radio value={null}>Tất cả</Radio>
              {[5, 4, 3, 2, 1].map((star) => (
                <Radio key={star} value={star}>
                  {star} sao
                </Radio>
              ))}
            </Radio.Group>
          </Space>

          <Space>
            <Text strong>Sắp xếp:</Text>
            <Select
              value={sortType}
              onChange={(value) => {
                setSortType(value);
                setCurrentPage(1);
              }}
              style={{ width: 160 }}
            >
              <Option value="newest">Mới nhất</Option>
              <Option value="highestStar">Sao cao nhất</Option>
              <Option value="lowestStar">Sao thấp nhất</Option>
            </Select>
          </Space>
        </Flex>

        <Flex vertical gap={12} style={{ marginTop: 16 }}>
          {paginatedReviews.map((r) => (
            <Card key={r.uid} size="small">
              <Flex vertical gap={4}>
                <Rate disabled defaultValue={r.star} />
                <Text>{r.reviewContent}</Text>
                <Text type="secondary" italic>
                  - {r.customerName} | {r.date}
                </Text>
              </Flex>
            </Card>
          ))}
        </Flex>

        <Pagination
          current={currentPage}
          pageSize={PAGE_SIZE}
          total={sortedReviews.length}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
          style={{ marginTop: 16 }}
        />
      </>
    );
  }

  return (
    <Flex vertical gap={16}>
      <Title level={4}>Đánh giá sản phẩm</Title>
      {content}
    </Flex>
  );
};

export default ProductReviewListComponent;
