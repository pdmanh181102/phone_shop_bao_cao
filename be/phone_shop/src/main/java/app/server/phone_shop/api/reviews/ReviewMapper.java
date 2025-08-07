package app.server.phone_shop.api.reviews;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    @Mapping(target = "orderItemUid", source = "orderItem.uid")
    @Mapping(target = "productUid", source = "orderItem.product.uid")
    @Mapping(target = "productName", source = "orderItem.product.name")
    @Mapping(target = "customerName", expression = "java(entity.getOrderItem().getOrder().getCustomer() != null ? entity.getOrderItem().getOrder().getCustomer().getFirstName() : \"Ẩn danh\")")
    ReviewDto toDto(ReviewEntity entity);
}
