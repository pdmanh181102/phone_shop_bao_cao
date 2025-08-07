package app.server.phone_shop.api.accounts;

import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import app.server.phone_shop.api.account_status.AccountStatusEnum;
import app.server.phone_shop.api.permissions.PermissionEnum;
import app.server.phone_shop.api.resources.ResourceEnum;
import app.server.phone_shop.api.role_privileges.RolePrivilegeEntity;
import app.server.phone_shop.api.roles.RoleDto;
import app.server.phone_shop.api.roles.RoleEntity;
import app.server.phone_shop.api.roles.RoleMapper;
import app.server.phone_shop.api.roles.RoleRepository;
import app.server.phone_shop.api.roles.RoleService;
import app.server.phone_shop.api.user_genders.GenderEnum;
import app.server.phone_shop.api.users.UserEntity;
import app.server.phone_shop.api.users.UserRepository;
import app.server.phone_shop.api.users.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository repository;
    private final UserRepository userRepository;
    private final AccountMapper mapper;
    private final UserService userService;
    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void createAdminAccount() {

        RoleEntity adminRole = RoleEntity.builder()
                .name("ADMIN")
                .build();

        List<PermissionEnum> permissions = List.of(PermissionEnum.READ_ALL, PermissionEnum.WRITE);
        List<ResourceEnum> resources = List.of(ResourceEnum.ACCOUNT, ResourceEnum.USER, ResourceEnum.ROLE);

        for (PermissionEnum permission : permissions) {
            for (ResourceEnum resource : resources) {
                RolePrivilegeEntity privilege = RolePrivilegeEntity.builder()
                        .role(adminRole)
                        .permission(permission)
                        .resource(resource)
                        .build();
                if (adminRole.getPrivileges() == null)
                    adminRole.setPrivileges(new LinkedList<>());
                adminRole.getPrivileges().add(privilege);
            }
        }
        roleRepository.save(adminRole);

        UserEntity userEntity = UserEntity.builder()
                .firstName("")
                .lastName("ADMIN")
                .gender(GenderEnum.ORTHER)
                .build();

        userEntity = userRepository.save(userEntity);

        String username = "admin";
        String password = "1";
        AccountEntity accountEntity = AccountEntity.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .user(userEntity)
                .roles(new HashSet<>())
                .status(AccountStatusEnum.ACTIVE).build();

        accountEntity.getRoles().add(adminRole);
        repository.save(accountEntity);

    }

    public Boolean hasAdmin() {
        AccountEntity entity = repository.findByUsername("admin").orElse(null);
        return entity != null;
    }

    public AccountDto create(UUID userUid, String username, String password) {
        UserEntity user = userService.getEntityByUid(userUid);
        AccountEntity entity = AccountEntity.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .user(user)
                .status(AccountStatusEnum.ACTIVE).build();
        return mapper.toDto(repository.save(entity));
    }

    public AccountDto getByUid(UUID uid) {
        AccountEntity entity = getEntityByUid(uid);
        return mapper.toDto(entity);
    }

    public AccountDto getByUsernameAndPassword(String username, String password) {
        AccountEntity entity = repository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("username does net exists"));
        if (!passwordEncoder.matches(password, entity.getPassword())) {
            throw new RuntimeException("Mật khẩu không đúng");
        }
        return mapper.toDto(entity);
    }

    public AccountDto login(String username, String password) {
        AccountEntity entity = repository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("username does net exists"));
        if (!passwordEncoder.matches(password, entity.getPassword())) {
            throw new RuntimeException("Mật khẩu không đúng");
        }
        if (entity.getStatus() != AccountStatusEnum.ACTIVE) {
            throw new RuntimeException("Tài khoản đã bị khóa!");
        }
        return mapper.toDto(entity);
    }

    public AccountEntity getEntityByUid(UUID uid) {
        AccountEntity entity = repository.findById(uid).orElseThrow(() -> new EntityNotFoundException());
        return entity;
    }

    public AccountDto getByUserUid(UUID userUid) {
        AccountEntity entity = repository.findByUserUid(userUid).orElseThrow(() -> new EntityNotFoundException());
        return mapper.toDto(entity);
    }

    public Page<AccountDto> getAll(Integer page, Integer size, String sort, String search) {
        String[] sortParts = (sort != null) ? sort.split(",") : new String[] { "id" };
        String sortBy = sortParts[0];
        Sort.Direction direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("desc"))
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        Sort sortObj = Sort.by(direction, sortBy);

        Specification<AccountEntity> spec = Specification.where(null);
        spec = spec.and(AccountSpecification.search(search));

        // Nếu page hoặc size null -> không phân trang, trả toàn bộ danh sách
        if (page == null || size == null) {
            List<AccountDto> result = repository.findAll(spec, sortObj)
                    .stream()
                    .map(mapper::toDto)
                    .toList();
            return new PageImpl<>(result); // Chuyển về Page để giữ kiểu trả về
        }

        // Có phân trang
        page = Math.max(page, 0);
        size = Math.max(size, 1);
        Pageable pageable = PageRequest.of(page, size, sortObj);

        Page<AccountEntity> entitiesPage = repository.findAll(spec, pageable);
        return entitiesPage.map(mapper::toDto);
    }

    public AccountDto updatePassword(UUID uid, String oldPassword, String password) {
        AccountEntity entity = getEntityByUid(uid);
        if (!passwordEncoder.matches(oldPassword, entity.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không đúng");
        }
        entity.setPassword(passwordEncoder.encode(password));
        return mapper.toDto(repository.save(entity));
    }

    public AccountDto fUpdatePassword(UUID uid, String password) {
        AccountEntity entity = getEntityByUid(uid);
        entity.setPassword(passwordEncoder.encode(password));
        return mapper.toDto(repository.save(entity));
    }

    // public AccountDto updatePhotoUrl(UUID uid, String photoUrl) {
    // AccountEntity entity = getEntityByUid(uid);
    // entity.setPhotoUrl(photoUrl);
    // return mapper.toDto(repository.save(entity));
    // }

    public AccountDto updateStatus(UUID uid, AccountStatusEnum status) {
        AccountEntity entity = getEntityByUid(uid);
        entity.setStatus(status);
        return mapper.toDto(repository.save(entity));
    }

    public AccountDto deleteByUid(UUID uid) {
        AccountEntity entity = getEntityByUid(uid);
        repository.delete(entity);
        return mapper.toDto(entity);
    }

    public boolean checkUsernameExists(String username) {
        AccountEntity entity = repository.findByUsername(username).orElse(null);
        return entity != null;
    }

    private final RoleMapper roleMapper;
    private final RoleService roleService;

    public Set<RoleDto> getAllRoles(UUID accountUid) {
        AccountEntity account = getEntityByUid(accountUid);
        Set<RoleEntity> roles = account.getRoles();
        return roles.stream()
                .map(roleMapper::toDto)
                .collect(Collectors.toSet());
    }

    public void addRole(UUID accountUid, UUID roleUid) {
        AccountEntity account = getEntityByUid(accountUid);
        RoleEntity role = roleService.getEntityByUid(roleUid);

        if (account.getRoles() == null) {
            account.setRoles(new HashSet<>());
        }

        if (!account.getRoles().contains(role)) {
            account.getRoles().add(role);
            repository.save(account);
        }
    }

    public void removeRole(UUID accountUid, UUID roleUid) {
        AccountEntity account = getEntityByUid(accountUid);
        RoleEntity role = roleService.getEntityByUid(roleUid);

        Set<RoleEntity> roles = account.getRoles();
        if (roles != null && roles.contains(role)) {
            roles.remove(role);
            repository.save(account);
        }
    }

}
