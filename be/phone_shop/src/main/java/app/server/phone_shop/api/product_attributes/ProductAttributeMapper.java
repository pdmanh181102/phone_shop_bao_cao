package app.server.phone_shop.api.product_attributes;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductAttributeMapper {
    ProductAttributeDto toDto(ProductAttributeEntity entity);
}
