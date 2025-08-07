"use client";

import { Card, Checkbox, Col, Modal, Row } from "antd";
import { useState } from "react";

const phones = Array.from({ length: 10 }, (_, i) => ({
  id: i + 100,
  name: `Sản phẩm ${i + 1}`,
  price: `${(10 + i) * 1_000_000}₫`,
  image: "https://via.placeholder.com/150",
}));

const AddProductModal = ({ open, onClose, onSelect }: any) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAdd = () => {
    const selectedProducts = phones.filter((p) => selectedIds.includes(p.id));
    onSelect(selectedProducts);
    setSelectedIds([]);
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Chọn sản phẩm"
      onCancel={onClose}
      onOk={handleAdd}
      okText="Thêm"
    >
      <Row gutter={[16, 16]}>
        {phones.map((phone) => (
          <Col span={8} key={phone.id}>
            <Card hoverable cover={<img alt={phone.name} src={phone.image} />}>
              <Checkbox
                checked={selectedIds.includes(phone.id)}
                onChange={() => toggleSelection(phone.id)}
              >
                {phone.name}
              </Checkbox>
              <br />
              <small>{phone.price}</small>
            </Card>
          </Col>
        ))}
      </Row>
    </Modal>
  );
};

export default AddProductModal;
