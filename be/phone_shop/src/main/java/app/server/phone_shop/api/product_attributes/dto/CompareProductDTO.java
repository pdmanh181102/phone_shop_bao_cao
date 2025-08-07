package app.server.phone_shop.api.product_attributes.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CompareProductDTO {
    private UUID uid;
    private String name;
    private Integer soldQuantity;
    private BigDecimal price;
    private Float star;
    private String photoUrl;
    private List<AttributeGroupDTO> attributeGroups;

}
