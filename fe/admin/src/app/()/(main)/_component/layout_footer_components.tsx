"use client";

import { Col, Row } from "antd";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#f5f5f5] text-sm text-gray-700 mt-10 pt-10 border-t">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Main Footer Grid */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={12} sm={8} md={6}>
            <h4 className="font-semibold mb-3">Chăm sóc khách hàng</h4>
            <ul className="space-y-2">
              <li>Trung tâm hỗ trợ</li>
              <li>Hướng dẫn mua hàng</li>
              <li>Chính sách đổi trả</li>
            </ul>
          </Col>

          <Col xs={12} sm={8} md={6}>
            <h4 className="font-semibold mb-3">Về chúng tôi</h4>
            <ul className="space-y-2">
              <li>Giới thiệu công ty</li>
              <li>Tuyển dụng</li>
              <li>Điều khoản sử dụng</li>
            </ul>
          </Col>

          <Col xs={12} sm={8} md={6}>
            <h4 className="font-semibold mb-3">Kết nối với chúng tôi</h4>
            <ul className="space-y-2 flex flex-col">
              <li className="flex items-center gap-2">
                <FaFacebook /> Facebook
              </li>
              <li className="flex items-center gap-2">
                <FaInstagram /> Instagram
              </li>
              <li className="flex items-center gap-2">
                <FaLinkedin /> LinkedIn
              </li>
            </ul>
          </Col>

          <Col xs={12} sm={8} md={6}>
            <h4 className="font-semibold mb-3">Liên hệ</h4>
            <ul className="space-y-2">
              <li>Email: support@example.com</li>
              <li>Hotline: 1900 123 456</li>
              <li>Địa chỉ: 123 Đường ABC, Quận XYZ</li>
            </ul>
          </Col>
        </Row>

        {/* Country list */}
        <div className="border-t border-gray-200 pt-4 text-center text-xs text-gray-500">
          <p>
            Quốc gia & Khu vực: Việt Nam | Thái Lan | Malaysia | Indonesia |
            Singapore
          </p>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-200 pt-4 text-center text-xs text-gray-500 mt-4 pb-6">
          © 2025 Công ty TNHH TMĐT Example. Tất cả các quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
