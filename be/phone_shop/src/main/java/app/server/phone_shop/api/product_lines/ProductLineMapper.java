package app.server.phone_shop.api.product_lines;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductLineMapper {
    ProductLineDto toDto(ProductLineEntity entity);
}
