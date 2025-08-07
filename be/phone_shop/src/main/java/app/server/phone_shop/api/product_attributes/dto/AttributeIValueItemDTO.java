package app.server.phone_shop.api.product_attributes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AttributeIValueItemDTO {
    private String value;

    public AttributeIValueItemDTO(AttributeIValueItemDTO original) {
        // TODO Auto-generated constructor stub
        this.value = original.value;
    }
}
