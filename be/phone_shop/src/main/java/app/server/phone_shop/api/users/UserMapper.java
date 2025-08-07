package app.server.phone_shop.api.users;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "gender", expression = "java(entity.getGender().getLabel())")
    UserDto toDto(UserEntity entity);
}
