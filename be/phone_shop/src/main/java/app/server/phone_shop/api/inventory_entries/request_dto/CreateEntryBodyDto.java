package app.server.phone_shop.api.inventory_entries.request_dto;

import java.util.Set;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CreateEntryBodyDto {
    private UUID supplierUid;
    private String reason;
    Set<CreateEntryItemDto> items;
}
