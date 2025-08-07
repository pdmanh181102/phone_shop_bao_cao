package app.server.phone_shop.api.role_privileges;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import app.server.phone_shop.api.permissions.PermissionEnum;
import app.server.phone_shop.api.resources.ResourceEnum;
import app.server.phone_shop.api.roles.RoleEntity;
import app.server.phone_shop.api.roles.RoleService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RolePrivilegeService {

    private final RolePrivilegeRepository repository;
    private final RolePrivilegeMapper mapper;
    private final RoleService roleService;

    public RolePrivilegeDto create(UUID roleUid, PermissionEnum permission, ResourceEnum resource) {
        RoleEntity role = roleService.getEntityByUid(roleUid);
        RolePrivilegeEntity entity = RolePrivilegeEntity.builder().role(role).permission(permission).resource(resource)
                .build();
        return mapper.toDto(repository.save(entity));
    }

    public RolePrivilegeEntity getEntityByUid(UUID uid) {
        RolePrivilegeEntity entity = repository.findById(uid).orElseThrow(() -> new EntityNotFoundException());
        return entity;
    }

    public Page<RolePrivilegeDto> getAll(UUID roleUid, Integer page, Integer size, String sort) {
        String[] sortParts = (sort != null) ? sort.split(",") : new String[] { "id" };
        String sortBy = sortParts[0];
        Sort.Direction direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("desc"))
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        Sort sortObj = Sort.by(direction, sortBy);

        Specification<RolePrivilegeEntity> spec = Specification.where(null);
        spec = spec.and(RolePrivilegeSpecification.hasRoleUid(roleUid));

        // Nếu page hoặc size null -> không phân trang, trả toàn bộ danh sách
        if (page == null || size == null) {
            List<RolePrivilegeDto> result = repository.findAll(spec, sortObj)
                    .stream()
                    .map(mapper::toDto)
                    .toList();
            return new PageImpl<>(result); // Chuyển về Page để giữ kiểu trả về
        }

        // Có phân trang
        page = Math.max(page, 0);
        size = Math.max(size, 1);
        Pageable pageable = PageRequest.of(page, size, sortObj);

        Page<RolePrivilegeEntity> brandPage = repository.findAll(spec, pageable);
        return brandPage.map(mapper::toDto);
    }

    public RolePrivilegeDto deleteByUid(UUID uid) {
        RolePrivilegeEntity brand = getEntityByUid(uid);
        repository.delete(brand);
        return mapper.toDto(brand);
    }
}
