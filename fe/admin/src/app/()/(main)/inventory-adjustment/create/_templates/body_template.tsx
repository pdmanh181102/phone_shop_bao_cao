'use client'

import { InventoryAdjustmentApi } from '@api/inventory_adjustment_api';
import ProductAvatarItemComponent from '@component/product_avatar_item_component';
import AddProductDialog from '@component/select_product_dialog';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';
import { Product } from '@type/product';
import { Button, Flex, Form, Table, TableColumnsType } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Typography from 'antd/es/typography/Typography';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import UpdateProductQuantityDialog from '../_dialogs/update_quantity_dialog';

interface CreateInventoryAdjustmentBodyTemplateProps {
}

const OPEN_DIALOG = {
    add_product: 'add_product',
    update_quantity: 'update_quantity',
    closed: 'closed'
}

interface FormData {
    reason: string;
    type: string
}

interface EntryItem {
    product_uid: string, quantity: number
}

interface MutationInputType {
    reason: string;
    items: EntryItem[]
}

const CreateInventoryAdjustmentBodyTemplate: React.FC<CreateInventoryAdjustmentBodyTemplateProps> = ({ }) => {

    // global
    const router = useRouter();

    // reason
    const [form] = Form.useForm<FormData>();

    const validateReason = async (_: any, value: string) => {
        if (!value || value.trim().length === 0) {
            return Promise.reject(new Error("Vui lòng nhập trường này"));
        }
        return Promise.resolve();
    };

    // product
    const [open_dialog, setOpenDialog] = useState<string>(OPEN_DIALOG.closed);
    const [selected_products, setSelectedProducts] = useState<Product[]>([]);
    const [items, setItems] = useState<EntryItem[]>([]);

    const [current_product_uid, setCurrentProductUid] = useState<string | null>(null);

    const getQuantity = (product_uid: string) => {
        const q = items.find(item => item.product_uid == product_uid);
        if (q) return q.quantity;
        return 0;
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
                render: (_, record: Product) => (<Flex justify='start' gap={20}>
                    <Typography>{`${getQuantity(record.uid)}`}</Typography>
                </Flex>)
            },
            {
                title: "Thao tác",
                key: "actions",
                width: 100,
                render: (_, record: Product) => (
                    <Flex gap={10} >
                        <Button type="primary" danger size="small" onClick={() => handleRemove(record.uid)}>
                            Xóa
                        </Button>
                        <Button type="primary" size="small" onClick={() => handleSetQuantity(record.uid)}>
                            Số lượng
                        </Button>
                    </Flex>
                ),
            },
        ],
        [items]
    );

    const handleSetQuantity = (product_uid: string) => {
        setCurrentProductUid(product_uid);
        setOpenDialog(OPEN_DIALOG.update_quantity);
    }

    const handleSuccess = (products: Product[]) => {

        const old_product_uids: string[] = selected_products.map(item => item.uid);
        const new_products: Product[] = products.filter(item => !old_product_uids.includes(item.uid));
        const combine_products = [...selected_products, ...new_products];

        const new_product_uids: string[] = new_products.map(item => item.uid);
        const new_quantities = []
        for (const product_uid of new_product_uids) {
            new_quantities.push({
                product_uid: product_uid,
                quantity: 1
            });
        }

        const combine_product_quantities = [...items, ...new_quantities];


        setSelectedProducts(combine_products)
        setItems(combine_product_quantities);
        setOpenDialog(OPEN_DIALOG.closed)
    }

    const create_inventory_adjustment_mutation = useMutation({
        mutationFn: ({ reason, items }: MutationInputType) => InventoryAdjustmentApi.create(reason, items),
        onSuccess: (result) => {
            router.push("/inventory-adjustment")
        },
        onError: (error: any) => {
            getMessageApi().error(error?.message || "Có lỗi xảy ra khi tạo phiếu nhập");
        }
    });


    const handleSubmit = async () => {
        try {
            if (items.length === 0) {
                throw new Error("Vui lòng chọn sản phẩm!");
            }
            const { reason } = await form.validateFields();
            create_inventory_adjustment_mutation.mutate({ reason, items });
        } catch (error: any) {
            const message = error?.message || "Lỗi!";
            getMessageApi().error(message);
        }
    }

    return <>
        <Flex vertical gap={10}>
            <Form form={form} layout="vertical" autoComplete="off" onFinish={handleSubmit}>

                <Flex vertical gap={20}>
                    <Form.Item
                        label="Lý do chỉnh sửa"
                        name="reason"
                        rules={[{ validator: validateReason }]}
                    >
                        <TextArea placeholder="Nhập lý do" maxLength={100} showCount />
                    </Form.Item>

                    <Flex gap={10} vertical>
                        <Flex gap={10}>
                            <Button type='primary' size="small" onClick={() => setOpenDialog(OPEN_DIALOG.add_product)}>Thêm sản phẩm</Button>
                        </Flex>
                        <Table scroll={{ x: 'max-content' }} pagination={false} rowKey={"uid"} dataSource={selected_products} columns={columns} />
                    </Flex>

                    <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                            <Button type="primary" htmlType="submit">
                                Lưu
                            </Button>
                        </div>
                    </Form.Item>
                </Flex>
            </Form>

        </Flex>
        <AddProductDialog open={open_dialog === OPEN_DIALOG.add_product} onCancel={() => {
            setOpenDialog(OPEN_DIALOG.closed)
        }} onSuccess={handleSuccess} />

        {current_product_uid && <UpdateProductQuantityDialog product_uid={current_product_uid} open={open_dialog === OPEN_DIALOG.update_quantity} onCancel={() => {
            setOpenDialog(OPEN_DIALOG.closed)
        }} onSuccess={(product_uid: string, quantity: number) => {
            setQuantity(product_uid, quantity);
            setOpenDialog(OPEN_DIALOG.closed)
        }} />}
    </>

};

export default CreateInventoryAdjustmentBodyTemplate;