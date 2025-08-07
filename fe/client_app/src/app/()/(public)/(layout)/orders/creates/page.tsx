// 'use client';

// import { OrderApi } from '@api/clients/order_api';
// import { ProductPhotoApi } from '@api/clients/product_photo_api';
// import { UserApi } from '@api/clients/user_api'; // <== import UserApi
// import { getMessageApi } from '@context/MessageContext';
// import { CartItem } from '@interface/cart_item';
// import { formatCurrencyVND } from '@util/format_util';
// import { Button, Form, Image, Input, Table, Typography } from 'antd';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';

// const { Title } = Typography;

// export default function CreateOrderPage() {
//     const [form] = Form.useForm();
//     const [items, setItems] = useState<CartItem[]>([]);
//     const [productAvatars, setProductAvatars] = useState<{ [key: string]: string }>({});
//     const router = useRouter();
//     const message = getMessageApi();

//     useEffect(() => {
//         const fetch = async () => {
//             const saved = localStorage.getItem("order_items");
//             if (!saved) {
//                 router.push("/carts");
//                 return;
//             }
//             const parsedItems = JSON.parse(saved) as CartItem[];

//             // load hình
//             const avatarMap: { [key: string]: string } = {};
//             for (const item of parsedItems) {
//                 try {
//                     const avatar = await ProductPhotoApi.readProductAvatar(item.product.uid);
//                     avatarMap[item.product.uid] = avatar.photo_url;
//                 } catch {
//                     avatarMap[item.product.uid] = "/placeholder.jpg";
//                 }
//             }

// // load thông tin user
// const userUid = localStorage.getItem("user_uid");
// if (userUid) {
//     try {
//         const user = await UserApi.readByUid(userUid);
//         form.setFieldsValue({
//             recipientName: `${user.last_name} ${user.first_name}`,
//             // recipientPhone: `${user.phone}`,
//             // address: user.address || "",
//         });
//     } catch {
//         message.warning("Không thể tải thông tin người dùng");
//     }
// }

//             setItems(parsedItems);
//             setProductAvatars(avatarMap);
//         };

//         fetch();
//     }, [form, message, router]);

//     const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

//     const handleSubmit = async (values: any) => {
//         try {
//             const { recipientName, recipientPhone, address, note } = values;

//             await OrderApi.create(note, address, recipientName, recipientPhone, items.map(item => ({
//                 product_uid: item.product.uid,
//                 quantity: item.quantity
//             })));

//             message.success("Đặt hàng thành công");
//             localStorage.removeItem("order_items");
//             router.push("/orders/history");
//         } catch (error: any) {
//             message.error(error.message || "Đặt hàng thất bại");
//         }
//     };

//     return (
//         <div style={{ maxWidth: 800, margin: '40px auto' }}>
//             <Title level={2}>Xác nhận đơn hàng</Title>

//             <Form layout="vertical" form={form} onFinish={handleSubmit}>
//                 <Form.Item
//                     label="Tên người nhận"
//                     name="recipientName"
//                     rules={[{ required: true, message: "Vui lòng nhập tên người nhận" }]}
//                 >
//                     <Input />
//                 </Form.Item>

//                 <Form.Item
//                     label="Số điện thoại"
//                     name="recipientPhone"
//                     rules={[
//                         { required: true, message: "Vui lòng nhập số điện thoại" },
//                         { pattern: /^[0-9]{1,12}$/, message: "Vui lòng chỉ nhập số" }
//                     ]}
//                 >
//                     <Input placeholder="Nhập số điện thoại" maxLength={12} showCount />
//                 </Form.Item>

//                 <Form.Item
//                     label="Địa chỉ nhận hàng"
//                     name="address"
//                     rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
//                 >
//                     <Input.TextArea rows={2} />
//                 </Form.Item>
//                 <Form.Item label="Ghi chú" name="note">
//                     <Input.TextArea rows={2} />
//                 </Form.Item>

//                 <Table
//                     dataSource={items}
//                     rowKey={(item) => item.product.uid}
//                     pagination={false}
//                     style={{ marginBottom: 16 }}
//                 >
//                     <Table.Column<CartItem>
//                         title="Hình ảnh"
//                         render={(item) => (
//                             <Image
//                                 width={80}
//                                 src={productAvatars[item.product.uid]}
//                                 alt={item.product.name}
//                                 fallback="/placeholder.jpg"
//                             />
//                         )}
//                     />
//                     <Table.Column<CartItem> title="Tên sản phẩm" render={(item) => item.product.name} />
//                     <Table.Column<CartItem> title="Số lượng" render={(item) => item.quantity} />
//                     <Table.Column<CartItem> title="Đơn giá" render={(item) => formatCurrencyVND(item.product.price)} />
//                     <Table.Column<CartItem> title="Thành tiền" render={(item) => formatCurrencyVND(item.quantity * item.product.price)} />
//                 </Table>

//                 <Title level={4}>Tổng tiền: {formatCurrencyVND(total)}</Title>

//                 <Form.Item>
//                     <Button type="primary" htmlType="submit">
//                         Xác nhận đặt hàng
//                     </Button>
//                 </Form.Item>
//             </Form>
//         </div>
//     );
// }

"use client";

import { CustomerApi } from "@/api/client/customer_api";
import { GHNLocationApi } from "@/api/client/ghn_location_api";
import { OrderApi } from "@/api/client/order_api";
import { calculateShippingFeeBySerViceTypeId } from "@/api/client/shipping_api";
import { useAllPaymentMethod } from "@/api/state/order/useAllPaymentMethod";
import { useProductByUids } from "@/api/state/product/useProductByUids";
import { Product } from "@/api/type/product";
import { getMessageApi } from "@/context/MessageContext";
import { AuthStorage } from "@/util/auth_storage";
import { formatCurrencyVND } from "@/util/format_util";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  SelectProps,
  Space,
  Table,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import CartItemAvatarComponent from "../../carts/_component/cart_item_avatar";

const { Title, Text } = Typography;

// manh them
interface FormData {
  note: string;
  address: string;
  recipientName: string;
  recipientPhone: string;
  paymentMethod: string;
}

export default function CreateOrderPage() {
  //#start manh them de tuong thich code

  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [changeQuantity, setChangeQuantity] = useState(false);

  const getProductUnitPrice = (productUid: string) => {
    const product = products.find((product) => product.uid == productUid);
    if (!product) {
      throw new Error("Sản phẩm không tồn tại!");
    }
    return product.price;
  };

  const { mutate: fetchProducts } = useProductByUids((result) => {
    console.log(result);

    setProducts(result);
    const defaultQty = Object.fromEntries(result.map((p) => [p.uid, 1]));
    setQuantities(defaultQty);
  });

  useEffect(() => {
    const orderItems = localStorage.getItem("order_items")
      ? localStorage.getItem("order_items")!.split(",")
      : [];
    fetchProducts(orderItems);

    const fetchUser = async () => {
      try {
        const provinces = await GHNLocationApi.getProvinces();
        setProvinces(provinces);
      } catch (e) {
        message.error("Không thể tải danh sách tỉnh thành");
      }

      // load thông tin user
      const userUid = AuthStorage.getAccountUid();
      if (userUid) {
        try {
          const user = await CustomerApi.readByUid(userUid);

          form.setFieldsValue({
            recipientName: `${user.lastName} ${user.firstName}`,
            recipientPhone: user.phoneNumber,
            address: user.address,
          });
        } catch {
          message.warning("Không thể tải thông tin người dùng");
        }
      }
    };

    fetchUser();
  }, []);

  //# ham tinh tien giao hang cua luc
  const fetchShippingFee = async () => {
    try {
      let weight = 0;
      let value = 0;
      for (const key in quantities) {
        const number = quantities[key];
        weight += number * 500;
        value += number * getProductUnitPrice(key);
      }

      if (selectedDistrict && selectedWard) {
        const fee = await calculateShippingFeeBySerViceTypeId(
          selectedDistrict,
          selectedWard,
          weight,
          value
        );
        setShippingFee(fee);
      }
    } catch (e) {
      console.error("Shipping Fee Error", e);
      message.warning("Không thể tính phí giao hàng");
    }
  };

  const handleQuantityChange = (uid: string, value: number) => {
    setQuantities((prev) => ({ ...prev, [uid]: value }));
    setChangeQuantity(!changeQuantity);
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "imageUrl",
      render: (_: any, record: Product) => (
        <CartItemAvatarComponent productUid={record.uid} />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Số lượng",
      dataIndex: "uid",
      render: (_: any, record: Product) => (
        <Space>
          <InputNumber
            min={1}
            value={quantities[record.uid]}
            onChange={(value) => handleQuantityChange(record.uid, value || 1)}
          />
        </Space>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      render: (price: number) => <Text>{formatCurrencyVND(price)}</Text>,
    },
    {
      title: "Thành tiền",
      dataIndex: "uid",
      render: (_: any, record: Product) => {
        const quantity = quantities[record.uid] || 1;
        const total = quantity * record.price;
        return <Text>{total.toLocaleString("vi-VN")}₫</Text>;
      },
    },
  ];
  //#end: manh them de tuong thich code

  const [form] = Form.useForm<FormData>();

  const [shippingFee, setShippingFee] = useState(0);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);

  const router = useRouter();
  const message = getMessageApi();

  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const provinces = await GHNLocationApi.getProvinces();
        setProvinces(provinces);
      } catch (e) {
        message.error("Không thể tải danh sách tỉnh thành");
      }
    };
    fetchProvince();
  }, []);

  const getAddress = () => {
    const province = provinces.find((p) => p.ProvinceID === selectedProvince);
    const district = districts.find((d) => d.DistrictID === selectedDistrict);
    const ward = wards.find((w) => w.WardCode === selectedWard);

    const provinceName = province?.ProvinceName || "";
    const districtName = district?.DistrictName || "";
    const wardName = ward?.WardName || "";

    return {
      provinceName,
      districtName,
      wardName,
      fullAddress: `${wardName ? wardName + ", " : ""}${
        districtName ? districtName + ", " : ""
      }${provinceName}`,
    };
  };

  useEffect(() => {
    if (selectedProvince)
      GHNLocationApi.getDistricts(selectedProvince)
        .then(setDistricts)
        .catch(console.error);
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict)
      GHNLocationApi.getWards(selectedDistrict)
        .then(setWards)
        .catch(console.error);
  }, [selectedDistrict]);

  useEffect(() => {
    fetchShippingFee();
  }, [selectedWard, changeQuantity]);

  const totalAmount = useMemo(() => {
    return products.reduce((sum, product) => {
      const quantity = quantities[product.uid] || 1;
      return sum + quantity * product.price;
    }, 0);
  }, [products, quantities]);

  const handleSubmit = async (values: FormData) => {
    try {
      const { recipientName, recipientPhone, address, note, paymentMethod } =
        values;

      const items = [];
      for (const productUid in quantities) {
        const quantity = quantities[productUid];
        items.push({
          productUid,
          quantity,
        });
      }

      const fullAddress = address + ", " + getAddress().fullAddress;

      await OrderApi.create({
        note,
        address: fullAddress,
        recipientName,
        recipientPhone,
        paymentMethod,
        shippingAmount: shippingFee,
        items,
      });

      message.success("Đặt hàng thành công");
      localStorage.removeItem("order_items");
      router.push("/orders");
    } catch (error: any) {
      message.error(error.message || "Đặt hàng thất bại");
    }
  };

  // manh them
  const { data: paymentMethods } = useAllPaymentMethod();

  const paymentMethodOptions: SelectProps<string>["options"] = useMemo(
    () =>
      paymentMethods?.map((item) => ({
        label: item.label,
        value: item.uid,
      })),
    [paymentMethods]
  );

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <Title level={2}>Xác nhận đơn hàng</Title>

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item
          label="Tên người nhận"
          name="recipientName"
          rules={[{ required: true, message: "Vui lòng nhập tên người nhận" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="recipientPhone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại" },
            { pattern: /^[0-9]{1,12}$/, message: "Vui lòng chỉ nhập số" },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" maxLength={12} showCount />
        </Form.Item>
        <Form.Item
          label="Địa chỉ nhận hàng"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item label="Tỉnh / Thành phố">
          <Select
            showSearch
            placeholder="Chọn tỉnh/thành phố"
            options={provinces.map((p) => ({
              label: p.ProvinceName,
              value: p.ProvinceID,
            }))}
            onChange={(value) => {
              setSelectedProvince(value);
              setSelectedDistrict(null);
              setSelectedWard(null);
              setDistricts([]);
              setWards([]);
            }}
            value={selectedProvince}
          />
        </Form.Item>
        <Form.Item label="Quận / Huyện">
          <Select
            showSearch
            placeholder="Chọn quận/huyện"
            options={districts.map((d) => ({
              label: d.DistrictName,
              value: d.DistrictID,
            }))}
            onChange={(value) => {
              setSelectedDistrict(value);
              setSelectedWard(null);
              setWards([]);
            }}
            value={selectedDistrict}
            disabled={!selectedProvince}
          />
        </Form.Item>
        <Form.Item label="Phường / Xã">
          <Select
            showSearch
            placeholder="Chọn phường/xã"
            options={wards.map((w) => ({
              label: w.WardName,
              value: w.WardCode,
            }))}
            onChange={(value) => {
              setSelectedWard(value);
            }}
            value={selectedWard}
            disabled={!selectedDistrict}
          />
        </Form.Item>
        <Form.Item label="Ghi chú" name="note">
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item
          label="Phương thức thanh toán"
          name="paymentMethod"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn phương thức thanh toán",
            },
          ]}
        >
          <Select
            placeholder="Chọn phương thức thanh toán"
            options={paymentMethodOptions}
          />
        </Form.Item>

        <Table
          dataSource={products}
          columns={columns}
          pagination={false}
          rowKey="uid"
          bordered
        />

        <Title level={4}>
          Phí vận chuyển: {formatCurrencyVND(shippingFee)}
        </Title>
        <Title level={4}>
          Tổng thanh toán: {formatCurrencyVND(totalAmount + shippingFee)}
        </Title>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Xác nhận đặt hàng
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
