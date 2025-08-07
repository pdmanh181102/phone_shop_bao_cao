'use client'

import { formatCurrencyVND } from "@/uitl/format_util";
import ProductAvatarItemComponent from "@component/product_avatar_item_component";
import AddProductDialog from "@component/select_product_dialog";
import { getMessageApi } from "@context/MessageContext";
import { useCreateImport } from "@state/import/useCreateImport";
import { useAllSupplier } from "@state/supplier/useAllSupplier";
import { Product } from "@type/product";
import { Breadcrumb, Button, Flex, Form, Input, Select, SelectProps, Table, TableColumnsType } from "antd";
import TextArea from "antd/es/input/TextArea";
import Link from "antd/es/typography/Link";
import Title from "antd/es/typography/Title";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

interface FormData {
    reason: string,
    supplier_uid: string
}

interface EntryItem {
    product_uid: string, quantity: number, unit_price: number
}

const CreateImportPage = () => {

    const router = useRouter();

    const [openDialog, setOpenDialog] = useState<string>("closed");
    const [selected_products, setSelectedProducts] = useState<Product[]>([]);
    const [items, setItems] = useState<EntryItem[]>([]);

    const [form] = Form.useForm<FormData>();

    const { data: supplierDatas, isLoading: supplierLoading } = useAllSupplier();

    const supplierOptions: SelectProps<string>['options'] = useMemo(() => supplierDatas?.content?.map(item => ({ label: item.name, value: item.uid })), [supplierDatas])


    const handleSuccess = (products: Product[]) => {

        const old_product_uids: string[] = selected_products.map(item => item.uid);
        const new_products: Product[] = products.filter(item => !old_product_uids.includes(item.uid));
        const combine_products = [...selected_products, ...new_products];

        const new_product_uids: string[] = new_products.map(item => item.uid);
        const new_quantities = []
        for (const product_uid of new_product_uids) {
            new_quantities.push({
                product_uid: product_uid,
                quantity: 1,
                unit_price: 0
            });
        }

        const combine_product_quantities = [...items, ...new_quantities];


        setSelectedProducts(combine_products)
        setItems(combine_product_quantities);
        setOpenDialog("closed")
    }

    const getQuantity = (product_uid: string) => {
        const q = items.find(item => item.product_uid == product_uid);
        if (q) return q.quantity;
        return 0;
    }

    const getUnitPrice = (product_uid: string) => {
        const q = items.find(item => item.product_uid == product_uid);
        if (q) return q.unit_price;
        return 0;
    }

    const getTotalMoney = () => {
        let totalMoney = 0;
        items.map(item => totalMoney += (item.quantity * (item.unit_price || 0)))
        return totalMoney;
    }

    const setQuantity = (product_uid: string, quantity: number) => {
        const q = items.map(item => {
            if (item.product_uid == product_uid) {
                item.quantity = quantity;
            }
            return item;
        });
        setItems([...q]);
    }

    const setUnitPrice = (product_uid: string, unit_price: number) => {
        const q = items.map(item => {
            if (item.product_uid == product_uid) {
                item.unit_price = unit_price
            }
            return item;
        });
        setItems([...q]);
    }

    const handleRemove = (product_uid: string) => {
        const sp = selected_products.filter(item => item.uid !== product_uid);
        const q = items.filter(item => item.product_uid !== product_uid);
        setSelectedProducts(sp);
        setItems(q);
    }

    const columns: TableColumnsType<Product> = useMemo(
        () => [
            {
                title: "UID",
                dataIndex: "uid",
                key: "uid",
                width: "200px"
            },
            {
                title: "Tên sản phẩm",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Hình ảnh",
                key: "avatar",
                render: (_, record: Product) => (<ProductAvatarItemComponent product_uid={record.uid} />)
            },
            {
                title: "Số lượng",
                key: "quantity",
                render: (_, record: Product) => <Input type="number" value={getQuantity(record.uid)} onChange={(e) => {
                    const value = Number(e.target.value);
                    setQuantity(record.uid, value);
                }} />
            },
            {
                title: "Đơn giá nhập",
                key: "quantity",
                render: (_, record: Product) => <Input type="number" value={getUnitPrice(record.uid)} onChange={(e) => {
                    const value = Number(e.target.value);
                    setUnitPrice(record.uid, value);
                }} />
            },
            {
                title: "Thành tiền",
                key: "quantity",
                render: (_, record: Product) => formatCurrencyVND((getQuantity(record.uid) * (getUnitPrice(record.uid) || 0)))
            },
            {
                title: "Thao tác",
                key: "actions",
                width: 100,
                render: (_, record: Product) => (
                    <Flex gap={10} wrap>
                        <Button type="primary" danger size="small" onClick={() => handleRemove(record.uid)}>
                            Xóa
                        </Button>
                    </Flex>
                ),
            },
        ],
        [items]
    );

    const validateReason = async (_: any, value: string) => {
        if (!value || value.trim().length === 0) {
            return Promise.reject(new Error("Vui lòng nhập trường này"));
        }
        return Promise.resolve();
    };

    const validateSelectBox = async (_: any, value: string) => {
        if (!value || value.trim().length === 0) {
            return Promise.reject(new Error("Vui lòng chọn nhà cung cấp"));
        }

        return Promise.resolve();
    };

    const validItems = () => {
        const item1 = items.find(item => item.quantity < 1);
        if (item1) {
            getMessageApi().error("Số lượng sản phẩm không hợp lệ!");
            return false;
        }

        const item2 = items.find(item => item.unit_price === undefined || item.unit_price <= 0);
        if (item2) {
            getMessageApi().error("Giá nhập không hợp lệ!");
            return false;
        }

        return true
    }

    const { create: createImport, loading } = useCreateImport(() => router.push("/imports"));

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (!validItems()) {
                return;
            }
            const { supplier_uid, reason } = await form.validateFields();
            createImport({
                supplier_uid,
                reason,
                items
            })
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    return <Flex vertical gap={20}>
        <Breadcrumb items={[
            {
                title: <Link href="/home">Home</Link>,
            }, {
                title: <Link href="/imports">Nhập kho</Link>,
            },
            {
                title: "Tạo phiếu nhập"
            },
        ]} />


        <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
            <Flex vertical gap={20}>
                <Form.Item
                    label="Nhà cung cấp"
                    name="supplier_uid"
                    rules={[{ validator: validateSelectBox }]}
                >
                    <Select loading={supplierLoading} options={supplierOptions} />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, marginTop: 24 }}
                    label="Lý do tạo phiếu"
                    name="reason"
                    rules={[{ validator: validateReason }]}
                >
                    <TextArea placeholder="Nhập lý do" maxLength={100} showCount />
                </Form.Item>

                <Flex gap={10} vertical>
                    <Flex gap={10}>
                        <Button type='primary' size="small" onClick={() => setOpenDialog("add_product")}>Thêm sản phẩm</Button>
                    </Flex>
                    <Table scroll={{ x: 'max-content' }} pagination={false} rowKey={"uid"} dataSource={selected_products} columns={columns} />
                </Flex>

                <Flex align="end" justify="end" gap={10}>
                    <Title level={5}>Tổng tiền: </Title>
                    <Title level={5}>
                        {formatCurrencyVND(getTotalMoney())}
                    </Title>
                </Flex>

                <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Lưu
                        </Button>
                    </div>
                </Form.Item>
            </Flex>
        </Form>

        <AddProductDialog open={openDialog === "add_product"} onCancel={() => {
            setOpenDialog("closed")
        }} onSuccess={handleSuccess} />
    </Flex>
};

export default CreateImportPage;
