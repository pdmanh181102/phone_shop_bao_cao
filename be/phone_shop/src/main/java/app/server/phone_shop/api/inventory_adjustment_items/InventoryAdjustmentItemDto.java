package app.server.phone_shop.api.inventory_adjustment_items;

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
public class InventoryAdjustmentItemDto extends AuditDto {
    private int quantity;
    private UUID uid;
    private UUID adjustmentUid;
    private UUID productUid;
    private int beforeQuantity;
}
