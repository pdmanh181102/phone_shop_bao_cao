package app.server.phone_shop.api.inventory_entry_types;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class InventoryEntryTypeDto {
    private String uid;
    private String label;
}
