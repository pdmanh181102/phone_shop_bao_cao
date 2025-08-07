package app.server.phone_shop.api.inventory_entries;

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
public class InventoryEntryDto extends AuditDto {

    private UUID uid;
    private String reason;
    private UUID supplierUid;
    private UUID staffUid;

}
