package app.server.phone_shop.api.accounts;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    @Mapping(target = "status", expression = "java(entity.getStatus().getLabel())")
    AccountDto toDto(AccountEntity entity);
}
