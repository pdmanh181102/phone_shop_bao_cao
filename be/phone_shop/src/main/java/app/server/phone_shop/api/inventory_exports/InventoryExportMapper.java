package app.server.phone_shop.api.inventory_exports;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InventoryExportMapper {
    @Mapping(target = "orderUid", source = "order.uid")
    InventoryExportDto toDto(InventoryExportEntity entity);
}
