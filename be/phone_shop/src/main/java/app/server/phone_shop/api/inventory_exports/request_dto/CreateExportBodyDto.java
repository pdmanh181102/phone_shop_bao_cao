package app.server.phone_shop.api.inventory_exports.request_dto;

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
public class CreateExportBodyDto {
    private UUID supplierUid;
    private String reason;
    Set<CreateExportItemDto> items;
}
