package app.server.phone_shop.api.products;

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
public class ProductDto extends AuditDto {
    private UUID uid;
    private String name;
    private Integer enteredQuantity;
    private Integer soldQuantity;
    private Integer currentQuantity;
    private BigDecimal price;
    private Float star;
    private String status;
}
