package app.server.phone_shop.api.orders.request_dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CreateOrderItemDto {
    private UUID productUid;
    private int quantity;
}
