package app.server.phone_shop.api.inventory_entry_items;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InventoryEntryItemMapper {
    @Mapping(target = "entryUid", source = "entry.uid")
    @Mapping(target = "productUid", source = "product.uid")
    InventoryEntryItemDto toDto(InventoryEntryItemEntity entity);
}
