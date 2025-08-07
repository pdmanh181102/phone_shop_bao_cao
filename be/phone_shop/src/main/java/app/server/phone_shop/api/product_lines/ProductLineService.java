package app.server.phone_shop.api.product_lines;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import app.server.phone_shop.api.brands.BrandEntity;
import app.server.phone_shop.api.brands.BrandService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductLineService {

    private final ProductLineRepository repository;
    private final ProductLineMapper mapper;

    private final BrandService brandService;

    public ProductLineDto create(UUID brandUid, String name) {
        BrandEntity brand = brandService.getEntityByUid(brandUid);
        ProductLineEntity entity = ProductLineEntity.builder().brand(brand).name(name).build();
        return mapper.toDto(repository.save(entity));
    }

    public ProductLineDto getByUid(UUID uid) {
        ProductLineEntity entity = getEntityByUid(uid);
        return mapper.toDto(entity);
    }

    public ProductLineEntity getEntityByUid(UUID uid) {
        ProductLineEntity entity = repository.findById(uid).orElseThrow(() -> new EntityNotFoundException());
        return entity;
    }

    public Page<ProductLineDto> getAll(UUID brandUid, Integer page, Integer size,
            String sort,
            String search) {
        String[] sortParts = (sort != null) ? sort.split(",") : new String[] { "id" };
        String sortBy = sortParts[0];
        Sort.Direction direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("desc"))
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        Sort sortObj = Sort.by(direction, sortBy);

        Specification<ProductLineEntity> spec = Specification.where(null);
        spec = spec.and(ProductLineSpecification.hasBrandUid(brandUid));
        spec = spec.and(ProductLineSpecification.search(search));
        spec = spec.and(ProductLineSpecification.isNotDefault());

        // Nếu page hoặc size null -> không phân trang, trả toàn bộ danh sách
        if (page == null || size == null) {
            List<ProductLineDto> result = repository.findAll(spec, sortObj)
                    .stream()
                    .map(mapper::toDto)
                    .toList();
            return new PageImpl<>(result); // Chuyển về Page để giữ kiểu trả về
        }

        // Có phân trang
        page = Math.max(page, 0);
        size = Math.max(size, 1);
        Pageable pageable = PageRequest.of(page, size, sortObj);

        Page<ProductLineEntity> brandPage = repository.findAll(spec, pageable);
        return brandPage.map(mapper::toDto);
    }

    public ProductLineDto updateName(UUID uid, String name) {
        ProductLineEntity brand = getEntityByUid(uid);
        brand.setName(name);
        return mapper.toDto(repository.save(brand));
    }

    public ProductLineDto deleteByUid(UUID uid) {
        ProductLineEntity brand = getEntityByUid(uid);
        repository.delete(brand);
        return mapper.toDto(brand);
    }

    public boolean checkNameExists(UUID brandUid, String name) {
        ProductLineEntity brand = repository.findByNameAndBrandUid(name, brandUid).orElse(null);
        return brand != null;
    }
}
