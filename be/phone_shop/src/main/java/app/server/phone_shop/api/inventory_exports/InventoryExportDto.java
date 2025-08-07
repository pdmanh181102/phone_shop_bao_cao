package app.server.phone_shop.api.inventory_exports;

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
public class InventoryExportDto extends AuditDto {

    private UUID uid;
    private String reason;
    private UUID orderUid;

}
