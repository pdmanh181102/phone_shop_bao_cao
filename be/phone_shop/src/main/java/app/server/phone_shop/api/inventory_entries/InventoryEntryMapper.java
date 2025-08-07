package app.server.phone_shop.api.inventory_entries;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InventoryEntryMapper {
    @Mapping(target = "supplierUid", expression = "java(entity.getSupplier().getUid())")
    @Mapping(target = "staffUid", expression = "java(entity.getStaff().getUid())")
    InventoryEntryDto toDto(InventoryEntryEntity entity);
}
