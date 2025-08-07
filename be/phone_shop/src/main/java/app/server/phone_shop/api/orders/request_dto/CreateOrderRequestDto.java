package app.server.phone_shop.api.orders.request_dto;

import java.math.BigDecimal;
import java.util.List;

import app.server.phone_shop.api.payment_methods.PaymentMethodEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
public class CreateOrderRequestDto {
    private String note;
    private String address;
    private String recipientName;
    private String recipientPhone;
    private PaymentMethodEnum paymentMethod;
    private BigDecimal shippingAmount;
    private List<CreateOrderItemDto> items;
}
