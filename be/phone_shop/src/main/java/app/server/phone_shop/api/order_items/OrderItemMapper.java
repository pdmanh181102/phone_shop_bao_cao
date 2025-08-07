package app.server.phone_shop.api.order_items;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {
    @Mapping(target = "orderUid", source = "order.uid")
    @Mapping(target = "productUid", source = "product.uid")
    OrderItemDto toDto(OrderItemEntity entity);
}
