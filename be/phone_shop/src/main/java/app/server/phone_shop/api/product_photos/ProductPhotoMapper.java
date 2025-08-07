package app.server.phone_shop.api.product_photos;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductPhotoMapper {
    ProductPhotoDto toDto(ProductPhotoEntity entity);
}
