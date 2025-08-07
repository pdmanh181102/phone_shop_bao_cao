package app.server.phone_shop.api.inventory_receipts.request_dto;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CreateReceiptBodyDto {
    private UUID entryUid;
    private String note;
    List<CreateReceiptItemDto> items;
}
