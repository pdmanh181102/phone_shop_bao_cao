"use client";

import { getCurrentProductQuantityNumber } from "@/uitl/extract_util";
import { formatCurrencyVND } from "@/uitl/format_util";
import ProductAvatarItemComponent from "@component/product_avatar_item_component";
import SelectOrderProduct from "@component/select_product_dialog_order";
import { getMessageApi } from "@context/MessageContext";
import { useCreateOrder } from "@state/order/useCreateOrder";
import { usePaymentMethodList } from "@state/payment_method/usePaymentMethodList";
import { Product } from "@type/product";
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Select,
  SelectProps,
  Table,
  TableColumnsType,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/typography/Title";
import Typography from "antd/es/typography/Typography";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

interface CreateOrderPageProps {}

const OPEN_DIALOG = {
  add_product: "add_product",
  closed: "closed",
};

interface FormData {
  note: string;
  address: string;
  recipient_name: string;
  recipient_phone: string;
  payment_method_uid: string;
}

interface EntryItem {
  product_uid: string;
  quantity: number;
  price: number;
  current_quantity: number;
}

interface MutationInputType {
  note: string;
  address: string;
  recipient_name: string;
  recipient_phone: string;
  items: EntryItem[];
}

const CreateOrderPage: React.FC<CreateOrderPageProps> = ({}) => {
  // global
  const router = useRouter();

  // reason
  const [form] = Form.useForm<FormData>();

  const [selectedPaymentMethodUid, setPaymentMethod] = useState<string | null>(
    null
  );

  const validateInput = async (_: any, value: string) => {
    if (!value || value.trim().length === 0) {
      return Promise.reject(new Error("Vui lòng nhập trường này"));
    }
    return Promise.resolve();
  };

  // product
  const [open_dialog, setOpenDialog] = useState<string>(OPEN_DIALOG.closed);
  const [selected_products, setSelectedProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<EntryItem[]>([]);

  const getQuantity = (product_uid: string) => {
    const q = items.find((item) => item.product_uid == product_uid);
    if (q) return q.quantity;
    return 0;
  };

  const getCurrentQuantity = (product_uid: string) => {
    const q = items.find((item) => item.product_uid == product_uid);
    if (q) return q.current_quantity;
    return 0;
  };

  const getTotalMoney = () => {
    let totalMoney = 0;
    items.map((item) => (totalMoney += item.quantity * (item.price || 0)));
    return totalMoney;
  };

  const plusQuantity = (product_uid: string) => {
    const q = items.map((item) => {
      if (
        item.product_uid == product_uid &&
        item.current_quantity > item.quantity
      ) {
        item.quantity++;
      }
      return item;
    });
    setItems([...q]);
  };

  const subQuantity = (product_uid: string) => {
    const q = items.map((item) => {
      if (item.product_uid == product_uid) {
        if (item.quantity > 1) item.quantity--;
      }
      return item;
    });
    setItems([...q]);
  };

  const handleRemove = (product_uid: string) => {
    const sp = selected_products.filter((item) => item.uid !== product_uid);
    const q = items.filter((item) => item.product_uid !== product_uid);
    setSelectedProducts(sp);
    setItems(q);
  };

  const columns: TableColumnsType<Product> = useMemo(
    () => [
      {
        title: "UID",
        dataIndex: "uid",
        key: "uid",
        width: "200px",
      },
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
        title: "Số lượng",
        key: "quantity",
        render: (_, record: Product) => (
          <Flex justify="start" gap={20}>
            <Button
              disabled={getQuantity(record.uid) === 1}
              onClick={() => subQuantity(record.uid)}
            >
              Bớt
            </Button>
            <Typography>{`${getQuantity(record.uid)}`}</Typography>
            <Button
              onClick={() => plusQuantity(record.uid)}
              disabled={
                getQuantity(record.uid) === getCurrentQuantity(record.uid)
              }
            >
              Thêm
            </Button>
          </Flex>
        ),
      },
      {
        title: "Đơn giá",
        dataIndex: "price",
        key: "price",
        render: (price: number) => formatCurrencyVND(price),
      },
      {
        title: "Thành tiền",
        key: "totalMoney",
        render: (_: any, record: Product) =>
          formatCurrencyVND(getQuantity(record.uid) * record.price),
      },
      {
        title: "Thao tác",
        key: "actions",
        width: 100,
        render: (_, record: Product) => (
          <Flex gap={10} wrap>
            <Button
              type="primary"
              danger
              size="small"
              onClick={() => handleRemove(record.uid)}
            >
              Xóa
            </Button>
          </Flex>
        ),
      },
    ],
    [items]
  );

  const handleSuccess = (products: Product[]) => {
    const old_product_uids: string[] = selected_products.map(
      (item) => item.uid
    );
    const new_products: Product[] = products.filter(
      (item) => !old_product_uids.includes(item.uid)
    );
    const combine_products = [...selected_products, ...new_products];

    const new_product_uids: string[] = new_products.map((item) => item.uid);
    const new_quantities = [];
    for (const product_uid of new_product_uids) {
      const p = combine_products.find((item) => item.uid == product_uid);
      new_quantities.push({
        product_uid: product_uid,
        quantity: 1,
        price: p!.price,
        current_quantity: getCurrentProductQuantityNumber(p),
      });
    }

    const combine_product_quantities = [...items, ...new_quantities];

    setSelectedProducts(combine_products);
    setItems(combine_product_quantities);
    setOpenDialog(OPEN_DIALOG.closed);
  };

  const { create: createOrder, loading } = useCreateOrder(() =>
    router.push("/orders")
  );

  const handleSubmit = async () => {
    try {
      if (items.length === 0) {
        throw new Error("Vui lòng chọn sản phẩm!");
      }
      const {
        note,
        address,
        recipient_name,
        recipient_phone,
        payment_method_uid,
      } = await form.validateFields();
      createOrder({
        note,
        address,
        recipient_name,
        recipient_phone,
        payment_method_uid,
        items,
      });
    } catch (error: any) {
      const message = error?.message || "Lỗi!";
      getMessageApi().error(message);
    }
  };

  const { data: paymentMethodDatas } = usePaymentMethodList();

  const paymentMethodOptions: SelectProps<string>["options"] = useMemo(
    () =>
      paymentMethodDatas?.map((item) => ({
        label: item.label,
        value: item.uid,
      })),
    [paymentMethodDatas]
  );

  return (
    <>
      <Flex vertical gap={10}>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          onFinish={handleSubmit}
        >
          <Flex vertical gap={20}>
            <Row gutter={10}>
              <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }}>
                <Form.Item
                  label="Tên người nhận"
                  name="recipient_name"
                  rules={[{ validator: validateInput }]}
                >
                  <Input
                    placeholder="Nhập tên người nhận hàng"
                    maxLength={100}
                    showCount
                  />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }}>
                <Form.Item
                  label="SĐT người nhận"
                  name="recipient_phone"
                  rules={[{ validator: validateInput }]}
                >
                  <Input
                    placeholder="Nhập số điện thoại"
                    maxLength={12}
                    showCount
                  />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }}>
                <Form.Item
                  label="Địa chỉ người nhận"
                  name="address"
                  rules={[{ validator: validateInput }]}
                >
                  <Input placeholder="Nhập địa chỉ" maxLength={200} showCount />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Ghi chú" name="note">
              <TextArea placeholder="Nhập ghi chú" maxLength={200} showCount />
            </Form.Item>

            <Form.Item
              label="Phương thức thanh toán"
              name="payment_method_uid"
              rules={[{ validator: validateInput }]}
            >
              <Select
                placeholder="Chọn phương thức thanh toán"
                options={paymentMethodOptions}
                value={selectedPaymentMethodUid}
                onChange={(value: string) => {
                  setPaymentMethod(value);
                }}
              />
            </Form.Item>

            <Flex gap={10} vertical>
              <Flex gap={10}>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => setOpenDialog(OPEN_DIALOG.add_product)}
                >
                  Thêm sản phẩm
                </Button>
              </Flex>
              <Table
                scroll={{ x: "max-content" }}
                pagination={false}
                rowKey={"uid"}
                dataSource={selected_products}
                columns={columns}
              />
            </Flex>

            <Flex align="end" justify="end" gap={10}>
              <Title level={5}>Tổng tiền: </Title>
              <Title level={5}>{formatCurrencyVND(getTotalMoney())}</Title>
            </Flex>

            <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
              <div
                style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
              >
                <Button type="primary" htmlType="submit">
                  Lưu
                </Button>
              </div>
            </Form.Item>
          </Flex>
        </Form>
        <SelectOrderProduct
          open={open_dialog === OPEN_DIALOG.add_product}
          onCancel={() => {
            setOpenDialog(OPEN_DIALOG.closed);
          }}
          onSuccess={handleSuccess}
        />
      </Flex>
    </>
  );
};

export default CreateOrderPage;
