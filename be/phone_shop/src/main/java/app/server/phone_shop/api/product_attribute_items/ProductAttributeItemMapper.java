package app.server.phone_shop.api.product_attribute_items;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductAttributeItemMapper {
    ProductAttributeItemDto toDto(ProductAttributeItemEntity entity);
}