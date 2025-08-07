package app.server.phone_shop.api.inventory_export_items;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InventoryExportItemMapper {
    @Mapping(target = "exportUid", source = "export.uid")
    @Mapping(target = "productUid", source = "product.uid")
    InventoryExportItemDto toDto(InventoryExportItemEntity entity);
}
