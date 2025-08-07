// 'use client';

// import { OrderApi } from '@api/clients/order_api';
// import { ProductApi } from '@api/clients/product_api';
// import { formatCurrencyVND } from '@util/format_util';
// import { Button, Card, Form, Input, InputNumber, Typography, message } from 'antd';
// import { useSearchParams } from 'next/navigation';
// import { useEffect, useState } from 'react';

// const { Title, Text } = Typography;

// const CreateOrderPage = () => {
//     const searchParams = useSearchParams();
//     const productUid = searchParams.get('productUid');

//     const [product, setProduct] = useState<any>(null);
//     const [loading, setLoading] = useState(true);

//     const [form] = Form.useForm();

//     useEffect(() => {
//         const fetchProduct = async () => {
//             try {
//                 if (!productUid) return;
//                 const res = await ProductApi.readByUid(productUid);
//                 setProduct(res);
//             } catch (err) {
//                 message.error('Không thể tải sản phẩm');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchProduct();
//     }, [productUid]);

//     const onFinish = async (values: any) => {
//         try {
//             await OrderApi.create({
//                 createdByStaff: false,
//                 note: '',
//                 recipientName: values.recipientName,
//                 recipientPhone: values.recipientPhone,
//                 address: values.address,
//                 items: [{
//                     productUid: product.uid,
//                     quantity: values.quantity
//                 }]
//             });
//             message.success('Đặt hàng thành công');
//         } catch (err) {
//             message.error('Đặt hàng thất bại');
//         }
//     };

//     if (loading || !product) return null;

//     return (
//         <Card style={{ maxWidth: 600, margin: '50px auto' }}>
//             <Title level={3}>Xác nhận đặt hàng</Title>
//             <Text strong>Tên sản phẩm:</Text> <Text>{product.name}</Text><br />
//             <Text strong>Đơn giá:</Text> <Text>{formatCurrencyVND(product.price)}</Text><br /><br />

//             <Form form={form} layout="vertical" onFinish={onFinish}>
//                 <Form.Item name="recipientName" label="Tên người nhận" rules={[{ required: true }]}>
//                     <Input />
//                 </Form.Item>
//                 <Form.Item name="recipientPhone" label="Số điện thoại" rules={[{ required: true }]}>
//                     <Input />
//                 </Form.Item>
//                 <Form.Item name="address" label="Địa chỉ nhận hàng" rules={[{ required: true }]}>
//                     <Input.TextArea />
//                 </Form.Item>
//                 <Form.Item name="quantity" label="Số lượng" rules={[{ required: true }]}>
//                     <InputNumber min={1} max={product.available_quantity || 10} />
//                 </Form.Item>
//                 <Form.Item>
//                     <Button type="primary" htmlType="submit">Xác nhận đặt hàng</Button>
//                 </Form.Item>
//             </Form>
//         </Card>
//     );
// };

// export default CreateOrderPage;

// 'use client';

// import { OrderApi } from '@api/clients/order_api';
// import { Order } from '@interface/order';
// import { formatCurrencyVND } from '@util/format_util';
// import { Table, Tag, Typography, message } from 'antd';
// import { ColumnsType } from 'antd/es/table';
// import { useEffect, useState } from 'react';

// const { Title } = Typography;

// export default function OrderHistoryPage() {
//     const [orders, setOrders] = useState<Order[]>([]);
//     const [loading, setLoading] = useState(false);

//     const fetchOrders = async () => {
//         try {
//             setLoading(true);
//             const data = await OrderApi.readAll();
//             setOrders(data);
//         } catch (error) {
//             message.error('Không thể tải danh sách đơn hàng');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchOrders();
//     }, []);

//     const columns: ColumnsType<Order> = [
//         {
//             title: 'Mã đơn hàng',
//             dataIndex: 'uid',
//             key: 'uid',
//             render: (uid: string) => <span>{uid.slice(0, 8)}...</span>
//         },
//         {
//             title: 'Tên người nhận',
//             dataIndex: 'recipient_name',
//             key: 'recipient_name'
//         },
//         {
//             title: 'Số điện thoại',
//             dataIndex: 'recipient_phone',
//             key: 'recipient_phone'
//         },
//         {
//             title: 'Địa chỉ',
//             dataIndex: 'address',
//             key: 'address'
//         },
//         {
//             title: 'Tổng tiền',
//             dataIndex: 'total_price',
//             key: 'total_price',
//             render: (price: number) => formatCurrencyVND(price)
//         },
//         {
//             title: 'Trạng thái',
//             dataIndex: 'status',
//             key: 'status',
//             render: (status: string) => <Tag color="blue">{status}</Tag>
//         }
//     ];

//     return (
//         <div style={{ padding: 24, marginTop: 80 }}>
//             <Title level={2}>Lịch sử đơn hàng</Title>
//             <Table
//                 dataSource={orders}
//                 columns={columns}
//                 rowKey="uid"
//                 loading={loading}
//                 pagination={{ pageSize: 5 }}
//             />
//         </div>
//     );
// }

// 'use client';

// import { OrderApi } from '@api/clients/order_api';
// import { Order } from '@interface/order';
// import { formatCurrencyVND, formatDateTimeVN } from '@util/format_util';
// import { Table, Typography, message } from 'antd';
// import { useEffect, useState } from 'react';

// const { Title } = Typography;

// export default function OrderHistoryPage() {
//     const [orders, setOrders] = useState<Order[]>([]);
//     const accountUid = localStorage.getItem('account_uid');

//     useEffect(() => {
//         const fetch = async () => {
//             try {
//                 if (!accountUid) return;
//                 const data = await OrderApi.readAllByUser(accountUid);
//                 setOrders(data);
//             } catch {
//                 message.error('Không thể tải lịch sử đơn hàng');
//             }
//         };
//         fetch();
//     }, []);

//     return (
//         <div style={{ padding: 24 }}>
//             <Title level={2}>Lịch sử đơn hàng</Title>
//             <Table dataSource={orders} rowKey="uid" pagination={{ pageSize: 5 }}>
//                 <Table.Column<Order> title="Mã đơn" dataIndex="uid" />
//                 <Table.Column<Order> title="Người nhận" dataIndex="recipient_name" />
//                 <Table.Column<Order> title="Số điện thoại" dataIndex="recipient_phone" />
//                 <Table.Column<Order> title="Địa chỉ" dataIndex="address" />
//                 <Table.Column<Order>
//                     title="Tổng tiền"
//                     render={(o) => formatCurrencyVND(o.total_amount)}
//                 />
//                 <Table.Column<Order> title="Trạng thái" dataIndex="status" />
//                 <Table.Column<Order>
//                     title="Ngày tạo"
//                     dataIndex="created_at"
//                     // render={(date) => new Date(date).toLocaleDateString('vi-VN')}
//                     // render: (date: Date) => formatDateTimeVN(date),
//                     render={(date) => formatDateTimeVN(date)}

//                 />

//                 <Table.Column<Order>
//                     title="Chi tiết"
//                     render={(order) => (
//                         <a href={`/orders/${order.uid}`}>Xem chi tiết</a>

//                     )}
//                 />
//             </Table>
//         </div>
//     );
// }

"use client";

import { CustomerApi } from "@/api/client/customer_api";
import { Order } from "@/api/type/order";
import { AuthStorage } from "@/util/auth_storage";
import { formatCurrencyVND, formatDateTimeVN } from "@/util/format_util";
import { Table, Tabs, TabsProps, Typography, message } from "antd";
import { useEffect, useMemo, useState } from "react";

const { Title } = Typography;

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("Tất cả");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const customterUid = AuthStorage.getAccountUid();
        if (!customterUid) return;
        const data = await CustomerApi.readAllOrder(customterUid);
        setOrders(data);
        setFilteredOrders(data); // mặc định là tất cả
      } catch {
        message.error("Không thể tải lịch sử đơn hàng");
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    if (statusFilter === "Tất cả") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((o) => o.status === statusFilter));
    }
  }, [statusFilter, orders]);

  const tabItems: TabsProps["items"] = useMemo(() => {
    const statusSet = new Set(orders.map((o) => o.status));
    const statusTabs = Array.from(statusSet).map((status) => ({
      key: status,
      label: status,
    }));

    return [{ key: "Tất cả", label: "Tất cả" }, ...statusTabs];
  }, [orders]);

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Lịch sử đơn hàng</Title>

      <Tabs
        defaultActiveKey="Tất cả"
        items={tabItems}
        onChange={(key) => setStatusFilter(key)}
        style={{ marginBottom: 16 }}
      />

      <Table
        dataSource={filteredOrders}
        rowKey="uid"
        pagination={{ pageSize: 10 }}
      >
        <Table.Column<Order> title="Mã đơn" dataIndex="uid" />
        <Table.Column<Order> title="Người nhận" dataIndex="recipientName" />
        <Table.Column<Order> title="Số điện thoại" dataIndex="recipientPhone" />
        <Table.Column<Order> title="Địa chỉ" dataIndex="address" />
        <Table.Column<Order>
          title="Tiền hàng"
          render={(o: Order) => formatCurrencyVND(o.totalAmount)}
        />
        <Table.Column<Order>
          title="Tiền ship"
          render={(o: Order) => formatCurrencyVND(o.shippingAmount)}
        />
        <Table.Column<Order>
          title="Tổng tiền"
          render={(o: Order) =>
            formatCurrencyVND(o.totalAmount + o.shippingAmount)
          }
        />
        <Table.Column<Order> title="Trạng thái" dataIndex="status" />
        <Table.Column<Order>
          title="Ngày tạo"
          dataIndex="createdAt"
          render={(date) => formatDateTimeVN(date)}
        />
        <Table.Column<Order>
          title="Chi tiết"
          render={(order) => <a href={`/orders/${order.uid}`}>Xem chi tiết</a>}
        />
      </Table>
    </div>
  );
}
