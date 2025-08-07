package app.server.phone_shop.api.brands;

import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import app.server.phone_shop.api.product_lines.ProductLineEntity;
import app.server.phone_shop.api.product_lines.ProductLineRepository;
import app.server.phone_shop.api.product_lines.ProductLineSpecification;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BrandService {

    private final BrandRepository repository;
    private final ProductLineRepository productLineRepository;
    private final BrandMapper mapper;

    public ProductLineEntity getDefaultProductLine(UUID brandUid) {
        return productLineRepository.findOne(ProductLineSpecification.isDefaultOfBrand(brandUid))
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy dòng sản phẩm mặc định cho brand " + brandUid));
    }

    public BrandDto create(String name) {
        BrandEntity entity = BrandEntity.builder()
                .name(name)
                .build();
        List<ProductLineEntity> productLines = new LinkedList<>();
        productLines.add(ProductLineEntity.builder()
                .name(name)
                .brand(entity)
                .isDefault(true)
                .build());
        entity.setProductLines(productLines);
        return mapper.toDto(repository.save(entity));
    }

    public BrandDto getByUid(UUID uid) {
        BrandEntity entity = getEntityByUid(uid);
        return mapper.toDto(entity);
    }

    public BrandEntity getEntityByUid(UUID uid) {
        BrandEntity entity = repository.findById(uid).orElseThrow(() -> new EntityNotFoundException());
        return entity;
    }

    public Page<BrandDto> getAll(Integer page, Integer size, String sort, String search) {
        String[] sortParts = (sort != null) ? sort.split(",") : new String[] { "id" };
        String sortBy = sortParts[0];
        Sort.Direction direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("desc"))
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        Sort sortObj = Sort.by(direction, sortBy);

        Specification<BrandEntity> spec = Specification.where(null);
        spec = spec.and(BrandSpecification.search(search));

        // Nếu page hoặc size null -> không phân trang, trả toàn bộ danh sách
        if (page == null || size == null) {
            List<BrandDto> result = repository.findAll(spec, sortObj)
                    .stream()
                    .map(mapper::toDto)
                    .toList();
            return new PageImpl<>(result); // Chuyển về Page để giữ kiểu trả về
        }

        // Có phân trang
        page = Math.max(page, 0);
        size = Math.max(size, 1);
        Pageable pageable = PageRequest.of(page, size, sortObj);

        Page<BrandEntity> brandPage = repository.findAll(spec, pageable);
        return brandPage.map(mapper::toDto);
    }

    public BrandDto updateName(UUID uid, String name) {
        BrandEntity brand = getEntityByUid(uid);
        brand.setName(name);
        return mapper.toDto(repository.save(brand));
    }

    public BrandDto updatePhotoUrl(UUID uid, String photoUrl) {
        BrandEntity brand = getEntityByUid(uid);
        brand.setPhotoUrl(photoUrl);
        return mapper.toDto(repository.save(brand));
    }

    public BrandDto deleteByUid(UUID uid) {
        BrandEntity brand = repository.findById(uid)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy brand"));

        // Kiểm tra các product line có liên kết product nào không
        boolean hasLinkedProduct = brand.getProductLines().stream()
                .anyMatch(productLine -> !productLine.getProducts().isEmpty());

        if (hasLinkedProduct) {
            throw new IllegalStateException("Không thể xóa brand vì có product line đang liên kết với product");
        }

        // Nếu không có liên kết, xóa brand (JPA sẽ tự xóa các product line do cascade)
        repository.delete(brand);
        return mapper.toDto(brand);
    }

    public boolean checkNameExists(String name) {
        BrandEntity brand = repository.findByName(name).orElse(null);
        return brand != null;
    }
}
