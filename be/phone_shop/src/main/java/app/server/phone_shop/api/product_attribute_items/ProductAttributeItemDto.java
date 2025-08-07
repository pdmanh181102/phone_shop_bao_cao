package app.server.phone_shop.api.product_attribute_items;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class ProductAttributeItemDto {
    private UUID uid;
    private String value;
}
