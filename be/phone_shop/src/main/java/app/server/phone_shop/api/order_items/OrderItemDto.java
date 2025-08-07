package app.server.phone_shop.api.order_items;

import java.math.BigDecimal;
import java.util.UUID;

import app.server.phone_shop.core.audit.AuditDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemDto extends AuditDto {
    private UUID uid;
    private int quantity;
    private UUID orderUid;
    private UUID productUid;
    private BigDecimal price;
}
