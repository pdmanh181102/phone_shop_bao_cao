package app.server.phone_shop.api.roles;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository repository;
    private final RoleMapper mapper;

    public RoleDto create(String name) {
        RoleEntity entity = RoleEntity.builder().name(name).build();
        return mapper.toDto(repository.save(entity));
    }

    public RoleDto getByUid(UUID uid) {
        RoleEntity brand = getEntityByUid(uid);
        return mapper.toDto(brand);
    }

    public RoleEntity getEntityByUid(UUID uid) {
        RoleEntity entity = repository.findById(uid).orElseThrow(() -> new EntityNotFoundException());
        return entity;
    }

    public Page<RoleDto> getAll(Integer page, Integer size, String sort, String search) {
        String[] sortParts = (sort != null) ? sort.split(",") : new String[] { "id" };
        String sortBy = sortParts[0];
        Sort.Direction direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("desc"))
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        Sort sortObj = Sort.by(direction, sortBy);

        Specification<RoleEntity> spec = Specification.where(null);
        spec = spec.and(RoleSpecification.search(search));

        // Nếu page hoặc size null -> không phân trang, trả toàn bộ danh sách
        if (page == null || size == null) {
            List<RoleDto> result = repository.findAll(spec, sortObj)
                    .stream()
                    .map(mapper::toDto)
                    .toList();
            return new PageImpl<>(result); // Chuyển về Page để giữ kiểu trả về
        }

        // Có phân trang
        page = Math.max(page, 0);
        size = Math.max(size, 1);
        Pageable pageable = PageRequest.of(page, size, sortObj);

        Page<RoleEntity> brandPage = repository.findAll(spec, pageable);
        return brandPage.map(mapper::toDto);
    }

    public RoleDto updateName(UUID uid, String name) {
        RoleEntity brand = getEntityByUid(uid);
        brand.setName(name);
        return mapper.toDto(repository.save(brand));
    }

    public RoleDto deleteByUid(UUID uid) {
        RoleEntity brand = getEntityByUid(uid);
        repository.delete(brand);
        return mapper.toDto(brand);
    }

    public boolean checkNameExists(String name) {
        RoleEntity brand = repository.findByName(name).orElse(null);
        return brand != null;
    }
}
