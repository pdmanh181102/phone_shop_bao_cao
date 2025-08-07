"use client";

import { Button, Typography, Card } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  FaChartBar,
  FaBoxOpen,
  FaShoppingCart,
  FaWarehouse,
  FaUsersCog,
  FaTags,
} from "react-icons/fa";

const { Title, Paragraph } = Typography;

const slides = [
  {
    title: "Phân tích thống kê",
    description:
      "Cung cấp số liệu thống kê tổng quan về doanh thu, sản phẩm bán chạy, đơn hàng, hàng tồn kho... Giúp ra quyết định hiệu quả.",
    icon: <FaChartBar size={48} className="text-blue-500" />,
  },
  {
    title: "Quản lý sản phẩm",
    description:
      "Bao gồm các tính năng: quản lý thương hiệu, dòng sản phẩm, sản phẩm với thông tin chi tiết và thuộc tính mở rộng.",
    icon: <FaBoxOpen size={48} className="text-green-500" />,
  },
  {
    title: "Quản lý kho",
    description:
      "Thực hiện các nghiệp vụ: nhập kho, xuất kho, điều chỉnh tồn kho, và quản lý nhà cung cấp. Kiểm soát tồn kho chính xác, minh bạch.",
    icon: <FaWarehouse size={48} className="text-orange-500" />,
  },
  {
    title: "Quản lý người dùng & phân quyền",
    description:
      "Hỗ trợ tạo tài khoản, quản lý người dùng, phân vai trò (role), cấp quyền (permission) chi tiết cho từng chức năng.",
    icon: <FaUsersCog size={48} className="text-purple-500" />,
  },
  {
    title: "Quản lý đơn hàng",
    description:
      "Tạo đơn hàng, cập nhật trạng thái, theo dõi tiến trình giao hàng, xử lý thanh toán và hỗ trợ khách hàng.",
    icon: <FaShoppingCart size={48} className="text-pink-500" />,
  },
];

const WelcomePage = () => {
  const [index, setIndex] = useState(0);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const current = slides[index];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-xl"
        >
          <Card
            bordered={false}
            className="text-center shadow-lg"
            style={{ borderRadius: 16 }}
          >
            <div className="mb-4 flex justify-center">{current.icon}</div>
            <Title level={3}>{current.title}</Title>
            <Paragraph style={{ fontSize: 16 }}>
              {current.description}
            </Paragraph>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-4 mt-6">
        <Button onClick={prevSlide}>Trước</Button>
        <Button type="primary" onClick={nextSlide}>
          Tiếp theo
        </Button>
      </div>

      <div className="flex mt-4 gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === index ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default WelcomePage;
