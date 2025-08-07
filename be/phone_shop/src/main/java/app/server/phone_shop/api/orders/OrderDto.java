package app.server.phone_shop.api.orders;

import java.math.BigDecimal;
import java.util.UUID;

import app.server.phone_shop.api.order_status.OrderStatusEnum;
import app.server.phone_shop.core.audit.AuditDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class OrderDto extends AuditDto {
    private UUID uid;
    private String note;
    private String address;
    private String recipientName;
    private String recipientPhone;
    private Boolean paid;
    private String apptransid;
    private String zptransid;
    private String paymentMethod;
    private String status;
    private UUID staffUid;
    private OrderStatusEnum statusUid;
    private UUID customerUid;
    private BigDecimal totalAmount;
    private BigDecimal shippingAmount;
    private BigDecimal paymentAmount;
    private BigDecimal paymentDiscountAmount;
    private String paymentRefundId;
}
