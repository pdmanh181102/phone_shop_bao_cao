"use client";

import { OrderApi } from "@/api/client/order_api";
import { ProductApi } from "@/api/client/product_api";
import { ReviewApi } from "@/api/client/review_api";
import { OrderItem } from "@/api/type/order";
import { Product } from "@/api/type/product";
import ProductAvatarItemComponent from "@/component/product_avatar_item_component";
import { getMessageApi } from "@/context/MessageContext";
import { OrderStatusLabel, OrderStatusModel } from "@/model/order_status_model";
import { formatCurrencyVND, formatNumberVN } from "@/util/format_util";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Flex, Input, Rate, Table, TableColumnsType } from "antd";
import { useEffect, useMemo, useState } from "react";

const { TextArea } = Input;

interface Props {
  order_uid: string;
  status_uid: string;
}

const ProductListAndReviewComponent: React.FC<Props> = ({
  order_uid,
  status_uid,
}) => {
  const message = getMessageApi();

  const { data: order_item_datas = [] } = useQuery<OrderItem[]>({
    queryKey: ["read_order_items", order_uid],
    queryFn: () => OrderApi.readAllItems(order_uid),
    staleTime: 0,
  });

  const [product_datas, setProductDatas] = useState<Product[]>([]);

  const get_products_mutation = useMutation({
    mutationFn: (product_uids: string[]) => ProductApi.readByUids(product_uids),
    onSuccess: (result) => setProductDatas(result),
    onError: (error: any) => message.error(error?.message || "Có lỗi xảy ra"),
  });

  useEffect(() => {
    const product_uids = order_item_datas.map((item) => item.productUid);
    if (product_uids.length > 0) get_products_mutation.mutate(product_uids);
  }, [order_item_datas]);

  const columns: TableColumnsType<Product> = useMemo(() => {
    const baseColumns: TableColumnsType<Product> = [
      {
        title: "Tên sản phẩm",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Hình ảnh",
        key: "avatar",
        render: (_, record: Product) => (
          <ProductAvatarItemComponent product_uid={record.uid} />
        ),
      },
      {
        title: "Đơn giá",
        key: "price",
        render: (_, record: Product) => {
          const item = order_item_datas.find(
            (i) => i.productUid === record.uid
          );
          return formatCurrencyVND(item?.price || 0);
        },
      },
      {
        title: "Số lượng",
        key: "quantity",
        render: (_, record: Product) => {
          const item = order_item_datas.find(
            (i) => i.productUid === record.uid
          );
          return formatNumberVN(item?.quantity || 0);
        },
      },
      {
        title: "Tổng tiền",
        key: "total",
        render: (_, record: Product) => {
          const item = order_item_datas.find(
            (i) => i.productUid === record.uid
          );
          return formatCurrencyVND((item?.price || 0) * (item?.quantity || 0));
        },
      },
    ];

    if (status_uid === OrderStatusLabel[OrderStatusModel.DELIVERED]) {
      baseColumns.push({
        title: "Đánh giá",
        key: "review",
        render: (_, record: Product) => {
          const orderItem = order_item_datas.find(
            (item) => item.productUid === record.uid
          );
          if (!orderItem) return null;
          return <ReviewButton order_item_uid={orderItem.uid} />;
        },
      });
    }

    return baseColumns;
  }, [order_item_datas, status_uid]);

  return (
    <Flex vertical gap={30}>
      <Table
        pagination={false}
        scroll={{ x: "max-content" }}
        rowKey={"uid"}
        dataSource={product_datas}
        columns={columns}
        loading={get_products_mutation.isPending}
      />
    </Flex>
  );
};

const ReviewButton: React.FC<{ order_item_uid: string }> = ({
  order_item_uid,
}) => {
  const message = getMessageApi();
  const [formVisible, setFormVisible] = useState(false);
  const [star, setStar] = useState<number>(0);
  const [reviewContent, setReviewContent] = useState<string>("");

  const { data: isReviewed, refetch } = useQuery({
    queryKey: ["is_reviewed", order_item_uid],
    queryFn: () => ReviewApi.existsByOrderItem(order_item_uid),
    enabled: !formVisible,
    staleTime: 0,
  });

  const review_mutation = useMutation({
    mutationFn: () =>
      ReviewApi.create({
        order_item_uid,
        review_content: reviewContent,
        star,
      }),
    onSuccess: () => {
      message.success("Đánh giá thành công");
      setFormVisible(false);
      refetch();
    },
    onError: (error: any) => {
      message.error(error?.message || "Không thể gửi đánh giá");
    },
  });

  if (isReviewed) return <span style={{ color: "green" }}>Đã đánh giá</span>;

  const handleSubmit = () => {
    if (!reviewContent.trim()) {
      message.warning("Vui lòng nhập nội dung đánh giá");
      return;
    }
    if (!star) {
      message.warning("Vui lòng chọn số sao");
      return;
    }
    review_mutation.mutate();
  };

  return (
    <Flex vertical gap={4}>
      {!formVisible ? (
        <Button type="link" onClick={() => setFormVisible(true)}>
          Đánh giá
        </Button>
      ) : (
        <>
          <Rate value={star} onChange={setStar} />
          <TextArea
            rows={2}
            placeholder="Nội dung đánh giá"
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
          />
          <Button type="primary" onClick={handleSubmit}>
            Gửi
          </Button>
        </>
      )}
    </Flex>
  );
};

export default ProductListAndReviewComponent;
