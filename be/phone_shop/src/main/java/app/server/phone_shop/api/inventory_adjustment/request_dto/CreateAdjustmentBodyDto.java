package app.server.phone_shop.api.inventory_adjustment.request_dto;

import java.util.Set;

import app.server.phone_shop.api.inventory_entry_types.InventoryEntryTypeEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CreateAdjustmentBodyDto {
    private String reason;
    private InventoryEntryTypeEnum type;
    Set<CreateAdjustmentItemDto> items;
}
