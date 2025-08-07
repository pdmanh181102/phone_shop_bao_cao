package app.server.phone_shop.api.role_privileges;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RolePrivilegeMapper {
    @Mapping(target = "permission", expression = "java(entity.getPermission().getLabel())")
    @Mapping(target = "resource", expression = "java(entity.getResource().getLabel())")
    RolePrivilegeDto toDto(RolePrivilegeEntity entity);
}
