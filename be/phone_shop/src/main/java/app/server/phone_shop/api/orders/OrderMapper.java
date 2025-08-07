package app.server.phone_shop.api.orders;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    @Mapping(target = "customerUid", expression = "java(entity.getCustomer() != null ? entity.getCustomer().getUid() : null)")
    @Mapping(target = "statusUid", expression = "java(entity.getStatus())")
    @Mapping(target = "status", expression = "java(entity.getStatus().getLabel())")
    @Mapping(target = "paymentMethod", expression = "java(entity.getPaymentMethod().getLabel())")
    @Mapping(target = "staffUid", expression = "java(entity.getStaff() != null ? entity.getStaff().getUid() : null)")
    OrderDto toDto(OrderEntity entity);
}
