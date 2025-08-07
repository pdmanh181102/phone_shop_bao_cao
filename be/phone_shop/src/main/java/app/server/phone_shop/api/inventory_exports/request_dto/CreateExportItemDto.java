package app.server.phone_shop.api.inventory_exports.request_dto;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateExportItemDto {
    private UUID productUid;
    private int quantity;
    private BigDecimal unitPrice;
}
