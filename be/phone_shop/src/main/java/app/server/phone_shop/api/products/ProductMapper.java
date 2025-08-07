package app.server.phone_shop.api.products;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(target = "status", expression = "java(entity.getStatus().getLabel())")
    ProductDto toDto(ProductEntity entity);
}
