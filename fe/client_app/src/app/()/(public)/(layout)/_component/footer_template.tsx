'use client';

import { Flex, Typography } from 'antd';
import Image from 'next/image';

const { Text, Link } = Typography;

const FooterTemplate = () => {
    return (
        <footer style={{
            backgroundColor: '#f5f5f5',
            padding: '30px 20px',
            fontSize: '14px',
            color: '#222', // màu chữ đen-xám dễ đọc
            fontFamily: "'Roboto', sans-serif", // font hỗ trợ tiếng Việt tốt
            lineHeight: 1.6,
        }}>
            <Flex justify="space-between" wrap="wrap" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Tổng đài hỗ trợ */}
                <div style={{ minWidth: '200px', marginBottom: 20 }}>
                    <h4 style={{ fontWeight: 'bold', fontSize: 16 }}>Tổng đài hỗ trợ</h4>
                    <div>Gọi mua: <Text strong style={{ color: '#222' }}>1900 232 460</Text> (8:00 - 21:30)</div>
                    <div>Khiếu nại: <Text strong style={{ color: '#222' }}>1800.1062</Text> (8:00 - 21:30)</div>
                    <div>Bảo hành: <Text strong style={{ color: '#222' }}>1900 232 464</Text> (8:00 - 21:00)</div>
                </div>

                {/* Về công ty */}
                <div style={{ minWidth: '200px', marginBottom: 20 }}>
                    <h4 style={{ fontWeight: 'bold', fontSize: 16 }}>Về công ty</h4>
                    <div><Link style={{ color: '#222' }} href="#">Giới thiệu công ty (PhoneShop.vn)</Link></div>
                    <div><Link style={{ color: '#222' }} href="#">Tuyển dụng</Link></div>
                    <div><Link style={{ color: '#222' }} href="#">Gửi góp ý, khiếu nại</Link></div>
                    <div><Link style={{ color: '#222' }} href="#">Tìm siêu thị (2.965 shop)</Link></div>
                </div>

                {/* Mạng xã hội */}
                <div style={{ minWidth: '200px', marginBottom: 20 }}>
                    <h4 style={{ fontWeight: 'bold', fontSize: 16 }}>Kết nối với chúng tôi</h4>
                    <Flex gap={10} wrap="wrap">
                        <Image src="/images/social/youtube.png" alt="YouTube" width={24} height={24} />
                        <Image src="/images/social/facebook.png" alt="Facebook" width={24} height={24} />
                        <Image src="/images/social/instagram.png" alt="Instagram" width={24} height={24} />
                        <Image src="/images/social/tiktok.png" alt="TikTok" width={24} height={24} />
                        <Image src="/images/social/threads.png" alt="Threads" width={24} height={24} />
                    </Flex>
                </div>

                {/* Thanh toán */}
                <div style={{ minWidth: '200px', marginBottom: 20 }}>
                    <h4 style={{ fontWeight: 'bold', fontSize: 16 }}>Hỗ trợ thanh toán</h4>
                    <Flex gap={10} wrap="wrap">
                        <Image src="/images/payments/visa.png" alt="Visa" width={40} height={24} />
                        <Image src="/images/payments/mastercard.png" alt="MasterCard" width={40} height={24} />
                        <Image src="/images/payments/momo.png" alt="MoMo" width={40} height={24} />
                        <Image src="/images/payments/zalopay.png" alt="ZaloPay" width={40} height={24} />
                        <Image src="/images/payments/vnpay.jpg" alt="VNPay" width={40} height={24} />
                        <Image src="/images/payments/momo.png" alt="Ví trả sau" width={40} height={24} />
                    </Flex>
                </div>
            </Flex>

            <div style={{
                borderTop: '1px solid #ccc',
                marginTop: 20,
                paddingTop: 20,
                fontSize: '12px',
                color: '#555',
                display: 'flex',              // dùng Flexbox
                justifyContent: 'center',     // căn giữa ngang
                alignItems: 'center',         // căn giữa dọc (nếu có chiều cao)
                textAlign: 'center'           // căn giữa văn bản
            }}>
                <Text>
                    © 2018. Công ty cổ phần PhoneShop. GPDKKD: 0301923217354 do sở KH & ĐT TP.HCM cấp ngày 02/01/2007.<br />
                    Địa chỉ: 97 Trần Đình Quang, P.Tân Định, Q.1, TP.Hồ Chí Minh. Email: <Link style={{ color: '#222' }} href="mailto:cskh@phoneshop.com">cskh@phoneshop.com</Link><br />
                    Chịu trách nhiệm nội dung: Nhóm em.
                </Text>
            </div>
        </footer>
    );
};

export default FooterTemplate;
