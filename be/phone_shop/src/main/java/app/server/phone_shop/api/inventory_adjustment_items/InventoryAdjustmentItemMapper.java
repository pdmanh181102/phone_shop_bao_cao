package app.server.phone_shop.api.inventory_adjustment_items;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InventoryAdjustmentItemMapper {
    @Mapping(target = "adjustmentUid", source = "adjustment.uid")
    @Mapping(target = "productUid", source = "product.uid")
    InventoryAdjustmentItemDto toDto(InventoryAdjustmentItemEntity entity);
}
