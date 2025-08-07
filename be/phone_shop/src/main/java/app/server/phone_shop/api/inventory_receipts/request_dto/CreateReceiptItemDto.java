package app.server.phone_shop.api.inventory_receipts.request_dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateReceiptItemDto {
    private UUID entryItemUid;
    private int quantity;
}
