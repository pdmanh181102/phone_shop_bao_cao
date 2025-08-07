package app.server.phone_shop.api.inventory_adjustment.request_dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateAdjustmentItemDto {
    private UUID productUid;
    private int quantity;
}
