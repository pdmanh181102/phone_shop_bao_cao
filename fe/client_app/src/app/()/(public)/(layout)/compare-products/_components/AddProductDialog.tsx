'use client';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Modal, Row } from 'antd';
import { useState } from 'react';

const phoneList = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Điện thoại ${i + 1}`,
    price: `${10 + i} triệu`,
    image: `https://via.placeholder.com/150?text=Phone+${i + 1}`
}));

const AddProductDialog = () => {
    const [open, setOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const toggleSelection = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleAdd = () => {
        const selectedPhones = phoneList.filter((p) => selectedIds.includes(p.id));
        const existing = JSON.parse(localStorage.getItem('compareList') || '[]');
        const updatedList = [...existing, ...selectedPhones];
        localStorage.setItem('compareList', JSON.stringify(updatedList));
        setOpen(false);
        setSelectedIds([]); // reset
    };

    return (
        <>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
                Thêm sản phẩm
            </Button>

            <Modal
                open={open}
                title="Chọn sản phẩm để so sánh"
                onCancel={() => setOpen(false)}
                onOk={handleAdd}
                okText="Thêm vào so sánh"
            >
                <Row gutter={[16, 16]}>
                    {phoneList.map((phone) => (
                        <Col xs={24} sm={12} md={8} key={phone.id}>
                            <Card
                                hoverable
                                cover={<img alt={phone.name} src={phone.image} />}
                            >
                                <Checkbox
                                    checked={selectedIds.includes(phone.id)}
                                    onChange={() => toggleSelection(phone.id)}
                                >
                                    {phone.name} - {phone.price}
                                </Checkbox>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Modal>
        </>
    );
};

export default AddProductDialog;
