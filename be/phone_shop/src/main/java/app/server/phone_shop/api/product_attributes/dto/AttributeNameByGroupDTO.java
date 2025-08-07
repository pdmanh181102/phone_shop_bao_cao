
package app.server.phone_shop.api.product_attributes.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AttributeNameByGroupDTO {
    private String groupName;

    private List<String> attributes;
}