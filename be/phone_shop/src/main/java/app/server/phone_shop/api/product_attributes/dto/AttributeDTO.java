package app.server.phone_shop.api.product_attributes.dto;

import java.util.List;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttributeDTO {
    private String name;
    private List<AttributeIValueItemDTO> values;

    // Copy constructor
    public AttributeDTO(AttributeDTO original) {
        // Initialize fields from the original object
        this.name = original.name; // replace field1 with actual field names
        // this.values = original.values; // replace field2 with actual field names
        // Add other fields as necessary
        this.values = original.values == null ? null
                : original.values.stream()
                        .map(AttributeIValueItemDTO::new) // dùng constructor copy của AttributeDTO
                        .collect(Collectors.toList());
    }

}
