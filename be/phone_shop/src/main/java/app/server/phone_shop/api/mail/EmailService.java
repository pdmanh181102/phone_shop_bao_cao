package app.server.phone_shop.api.mail;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import app.server.phone_shop.api.order_items.OrderItemDto;
import app.server.phone_shop.api.order_status.OrderStatusEnum;
import app.server.phone_shop.api.products.ProductEntity;
import app.server.phone_shop.api.products.ProductService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private ProductService productService;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendOtpEmail(String toEmail, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Mã xác thực OTP của bạn");
            message.setText("Mã OTP của bạn là: " + otp + "\nLưu ý: mã có hiệu lực trong 5 phút.");
            message.setFrom(fromEmail);
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendOrderStatusEmail(String toEmail, String customerName, UUID orderUid,
            List<OrderItemDto> items, OrderStatusEnum status) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Thông báo đơn hàng - " + orderUid);

            // Nội dung trạng thái
            String[] statusContent = getStatusContent(status, customerName, orderUid);
            String color = statusContent[0];
            String title = statusContent[1];
            String messageBody = statusContent[2];

            // HTML table rows
            StringBuilder itemRows = new StringBuilder();
            BigDecimal grandTotal = new BigDecimal(0);

            for (OrderItemDto item : items) {
                ProductEntity product = productService.getEntityByUid(item.getProductUid());

                itemRows.append("""
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">%s</td>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">%d</td>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">%.2f VND</td>
                        </tr>
                        """.formatted(product.getName(), item.getQuantity(),
                        item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))));
                grandTotal = grandTotal.add(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            }

            String htmlContent = """
                    <html>
                    <body style="font-family: Arial, sans-serif; background-color: #f8f8f8; padding: 20px;">
                        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                            <h2 style="color: %s;">%s</h2>
                            <p>%s</p>
                            <h3>Thông tin đơn hàng:</h3>
                            <table style="width: 100%%; border-collapse: collapse;">
                                <thead>
                                    <tr>
                                        <th style="padding: 8px; border-bottom: 2px solid #333; text-align: left;">Sản phẩm</th>
                                        <th style="padding: 8px; border-bottom: 2px solid #333;">Số lượng</th>
                                        <th style="padding: 8px; border-bottom: 2px solid #333;">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    %s
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="2" style="padding: 8px; text-align: right;"><strong>Tổng cộng:</strong></td>
                                        <td style="padding: 8px;"><strong>%.2f VND</strong></td>
                                    </tr>
                                </tfoot>
                            </table>
                            <p style="margin-top: 20px;">Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ bộ phận chăm sóc khách hàng của chúng tôi.</p>
                            <p>Trân trọng,<br><strong>Phone Shop Team</strong></p>
                        </div>
                    </body>
                    </html>
                    """
                    .formatted(color, title, messageBody, itemRows, grandTotal);

            helper.setText(htmlContent, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    private String[] getStatusContent(OrderStatusEnum status, String customerName, UUID orderUid) {
        return switch (status) {
            case CHUA_THANH_TOAN -> new String[] {
                    "#FFA500",
                    "Chưa thanh toán",
                    "Xin chào <strong>%s</strong>,<br>Đơn hàng <strong>%s</strong> của bạn đã được tạo nhưng chưa thanh toán. Vui lòng hoàn tất thanh toán để chúng tôi xử lý đơn hàng."
                            .formatted(customerName, orderUid)
            };
            case CHO_XU_LY -> new String[] {
                    "#2196F3",
                    "Đang chờ xử lý",
                    "Xin chào <strong>%s</strong>,<br>Chúng tôi đã nhận được đơn hàng <strong>%s</strong> và đang xử lý. Cảm ơn bạn đã mua sắm tại Phone Shop."
                            .formatted(customerName, orderUid)
            };
            case DANG_GIAO_HANG -> new String[] {
                    "#9C27B0",
                    "Đang giao hàng",
                    "Xin chào <strong>%s</strong>,<br>Đơn hàng <strong>%s</strong> của bạn đang được giao. Vui lòng để ý điện thoại để nhận hàng."
                            .formatted(customerName, orderUid)
            };
            case DA_GIAO_HANG -> new String[] {
                    "#4CAF50",
                    "Giao hàng thành công",
                    "Xin chào <strong>%s</strong>,<br>Đơn hàng <strong>%s</strong> đã được giao thành công. Cảm ơn bạn đã tin tưởng Phone Shop."
                            .formatted(customerName, orderUid)
            };
            case DA_HUY -> new String[] {
                    "#FF4C4C",
                    "Đơn hàng đã hủy",
                    "Xin chào <strong>%s</strong>,<br>Rất tiếc, đơn hàng <strong>%s</strong> của bạn đã bị hủy. Nếu bạn cần hỗ trợ, hãy liên hệ với chúng tôi."
                            .formatted(customerName, orderUid)
            };
            case GIAO_HANG_THAT_BAI -> new String[] {
                    "#f44336",
                    "Giao hàng thất bại",
                    "Xin chào <strong>%s</strong>,<br>Chúng tôi không thể giao đơn hàng <strong>%s</strong> thành công. Vui lòng liên hệ lại để được hỗ trợ."
                            .formatted(customerName, orderUid)
            };
            case DA_HOAN_TIEN -> new String[] {
                    "#03A9F4",
                    "Đã hoàn tiền",
                    "Xin chào <strong>%s</strong>,<br>Chúng tôi đã hoàn tiền cho đơn hàng <strong>%s</strong>. Cảm ơn bạn đã thông cảm."
                            .formatted(customerName, orderUid)
            };
        };
    }

}