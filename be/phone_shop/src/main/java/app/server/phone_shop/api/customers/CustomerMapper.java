package app.server.phone_shop.api.customers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CustomerMapper {

    @Mapping(target = "status", expression = "java(entity.getStatus().getLabel())")
    @Mapping(target = "gender", expression = "java(entity.getGender().getLabel())")
    CustomerDto toDto(CustomerEntity entity);
}
