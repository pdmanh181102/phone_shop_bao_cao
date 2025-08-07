package app.server.phone_shop.api.inventory_adjustment;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InventoryAdjustmentMapper {
    @Mapping(target = "staffUid", expression = "java(entity.getStaff().getUid())")
    InventoryAdjustmentEntryDto toDto(InventoryAdjustmentEntity entity);
}
