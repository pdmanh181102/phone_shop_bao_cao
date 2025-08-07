package app.server.phone_shop.api.product_attributes.dto;

import java.util.List;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttributeGroupDTO {
    public AttributeGroupDTO(AttributeGroupDTO original) {
        // TODO Auto-generated constructor stub
        this.groupName = original.groupName;

        // Deep copy danh sách attributes
        this.attributes = original.attributes == null ? null
                : original.attributes.stream()
                        .map(AttributeDTO::new) // dùng constructor copy của AttributeDTO
                        .collect(Collectors.toList());
    }

    private String groupName;
    private List<AttributeDTO> attributes;

}
