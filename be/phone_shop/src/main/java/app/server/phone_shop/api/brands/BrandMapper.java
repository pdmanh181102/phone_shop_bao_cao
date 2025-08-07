package app.server.phone_shop.api.brands;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BrandMapper {
    BrandDto toDto(BrandEntity entity);
}
