package app.server.phone_shop.api.inventory_receipts;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InventoryReceiptMapper {
    @Mapping(target = "staffUid", expression = "java(entity.getStaff().getUid())")
    @Mapping(target = "entryUid", expression = "java(entity.getEntry().getUid())")
    InventoryReceiptDto toDto(InventoryReceiptEntity entity);
}
