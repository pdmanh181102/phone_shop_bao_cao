package app.server.phone_shop.api.inventory_receipts;

import java.util.UUID;

import app.server.phone_shop.core.audit.AuditEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
@Builder
public class InventoryReceiptDto extends AuditEntity {
    private UUID uid;
    private String note;
    private UUID staffUid;
    private UUID entryUid;
}
