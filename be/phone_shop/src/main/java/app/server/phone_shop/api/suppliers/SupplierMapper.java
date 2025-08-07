package app.server.phone_shop.api.suppliers;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SupplierMapper {
    SupplierDto toDto(SupplierEntity entity);
}
