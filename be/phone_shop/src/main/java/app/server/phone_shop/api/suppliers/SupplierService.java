package app.server.phone_shop.api.suppliers;

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
public class SupplierService {

    private final SupplierRepository repository;
    private final SupplierMapper mapper;

    public SupplierDto create(String name) {
        SupplierEntity entity = SupplierEntity.builder().name(name).build();
        return mapper.toDto(repository.save(entity));
    }

    public SupplierDto getByUid(UUID uid) {
        SupplierEntity entity = getEntityByUid(uid);
        return mapper.toDto(entity);
    }

    public SupplierEntity getEntityByUid(UUID uid) {
        SupplierEntity entity = repository.findById(uid).orElseThrow(() -> new EntityNotFoundException());
        return entity;
    }

    public Page<SupplierDto> getAll(Integer page, Integer size, String sort, String search) {
        String[] sortParts = (sort != null) ? sort.split(",") : new String[] { "id" };
        String sortBy = sortParts[0];
        Sort.Direction direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("desc"))
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        Sort sortObj = Sort.by(direction, sortBy);

        Specification<SupplierEntity> spec = Specification.where(null);
        spec = spec.and(SupplierSpecification.search(search));

        // Nếu page hoặc size null -> không phân trang, trả toàn bộ danh sách
        if (page == null || size == null) {
            List<SupplierDto> result = repository.findAll(spec, sortObj)
                    .stream()
                    .map(mapper::toDto)
                    .toList();
            return new PageImpl<>(result); // Chuyển về Page để giữ kiểu trả về
        }

        // Có phân trang
        page = Math.max(page, 0);
        size = Math.max(size, 1);
        Pageable pageable = PageRequest.of(page, size, sortObj);

        Page<SupplierEntity> brandPage = repository.findAll(spec, pageable);
        return brandPage.map(mapper::toDto);
    }

    public SupplierDto updateName(UUID uid, String name) {
        SupplierEntity brand = getEntityByUid(uid);
        brand.setName(name);
        return mapper.toDto(repository.save(brand));
    }

    public SupplierDto updatePhotoUrl(UUID uid, String photoUrl) {
        SupplierEntity brand = getEntityByUid(uid);
        brand.setPhotoUrl(photoUrl);
        return mapper.toDto(repository.save(brand));
    }

    public SupplierDto deleteByUid(UUID uid) {
        SupplierEntity brand = getEntityByUid(uid);
        repository.delete(brand);
        return mapper.toDto(brand);
    }

    public boolean checkNameExists(String name) {
        SupplierEntity brand = repository.findByName(name).orElse(null);
        return brand != null;
    }
}
