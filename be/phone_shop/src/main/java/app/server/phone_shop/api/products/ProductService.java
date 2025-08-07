package app.server.phone_shop.api.products;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import app.server.phone_shop.api.brands.BrandDto;
import app.server.phone_shop.api.brands.BrandMapper;
import app.server.phone_shop.api.brands.BrandService;
import app.server.phone_shop.api.product_lines.ProductLineDto;
import app.server.phone_shop.api.product_lines.ProductLineEntity;
import app.server.phone_shop.api.product_lines.ProductLineMapper;
import app.server.phone_shop.api.product_lines.ProductLineRepository;
import app.server.phone_shop.api.product_lines.ProductLineService;
import app.server.phone_shop.api.product_lines.ProductLineSpecification;
import app.server.phone_shop.api.product_status.ProductStatusEnum;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository repository;
    private final ProductLineRepository productLineRepository;
    private final ProductMapper mapper;
    private final BrandMapper brandMapper;
    private final ProductLineMapper productLineMapper;

    private final BrandService brandService;
    private final ProductLineService productLineService;

    public BrandDto getBrand(UUID productUid) {
        ProductEntity entity = getEntityByUid(productUid);

        // Tìm product line mặc định
        ProductLineEntity defaultProductLine = entity.getProductLines().stream()
                .filter(ProductLineEntity::getIsDefault)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Product không có product line mặc định"));

        return brandMapper.toDto(defaultProductLine.getBrand());
    }

    public ProductDto create(UUID brandUid, String name) {
        ProductLineEntity defaultProductLine = brandService.getDefaultProductLine(brandUid);
        ProductEntity entity = ProductEntity.builder()
                .name(name)
                .status(ProductStatusEnum.DISABLE)
                .productLines(Set.of(defaultProductLine))
                .build();
        return mapper.toDto(repository.save(entity));
    }

    public ProductDto getByUid(UUID uid) {
        ProductEntity entity = getEntityByUid(uid);
        return mapper.toDto(entity);
    }

    public ProductEntity getEntityByUid(UUID uid) {
        ProductEntity entity = repository.findById(uid).orElseThrow(() -> new EntityNotFoundException());
        return entity;
    }

    public Page<ProductDto> getAll(Set<UUID> productUids, Set<UUID> brandUids, Set<ProductStatusEnum> statuses,
            Set<UUID> productLineUids,
            Integer page, Integer size,
            String sort, String search) {
        String[] sortParts = (sort != null) ? sort.split(",") : new String[] { "id" };
        String sortBy = sortParts[0];
        Sort.Direction direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("desc"))
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        Sort sortObj = Sort.by(direction, sortBy);

        Specification<ProductEntity> spec = Specification.where(null);
        spec = spec.and(ProductSpecification.hasProductUids(productUids));
        spec = spec.and(ProductSpecification.hasBrandUids(brandUids));
        spec = spec.and(ProductSpecification.hasProductLineUids(productLineUids));
        spec = spec.and(ProductSpecification.hasStatus(statuses));
        spec = spec.and(ProductSpecification.search(search));

        // Nếu page hoặc size null -> không phân trang, trả toàn bộ danh sách
        if (page == null || size == null) {
            List<ProductDto> result = repository.findAll(spec, sortObj)
                    .stream()
                    .map(mapper::toDto)
                    .toList();
            return new PageImpl<>(result); // Chuyển về Page để giữ kiểu trả về
        }

        // Có phân trang
        page = Math.max(page, 0);
        size = Math.max(size, 1);
        Pageable pageable = PageRequest.of(page, size, sortObj);

        Page<ProductEntity> entityPage = repository.findAll(spec, pageable);
        return entityPage.map(mapper::toDto);
    }

    public ProductDto updateName(UUID uid, String name) {
        ProductEntity entity = getEntityByUid(uid);
        entity.setName(name);
        return mapper.toDto(repository.save(entity));
    }

    public ProductDto updatePrice(UUID uid, BigDecimal price) {
        ProductEntity entity = getEntityByUid(uid);
        entity.setPrice(price);
        return mapper.toDto(repository.save(entity));
    }

    public ProductDto updateStatus(UUID uid, ProductStatusEnum status) {
        ProductEntity entity = getEntityByUid(uid);
        entity.setStatus(status);
        return mapper.toDto(repository.save(entity));
    }

    @Transactional
    public ProductDto deleteByUid(UUID uid) {
        ProductEntity entity = getEntityByUid(uid);
        entity.getProductLines().clear();
        repository.save(entity);
        repository.delete(entity);
        return mapper.toDto(entity);
    }

    public boolean checkNameExists(UUID brandUid, String name) {
        ProductEntity entity = repository.findByName(name).orElse(null);
        return entity != null;
    }

    public Page<ProductLineDto> getProductLinesByBrandAndProduct(UUID productUid, boolean has) {
        ProductEntity product = repository.findById(productUid)
                .orElseThrow(() -> new EntityNotFoundException("Product không tồn tại"));

        // Lấy brand từ product thông qua product line mặc định
        UUID brandUid = product.getProductLines().stream()
                .filter(ProductLineEntity::getIsDefault)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Product không có product line mặc định"))
                .getBrand()
                .getUid();

        Specification<ProductLineEntity> spec = Specification.where(ProductLineSpecification.hasBrandUid(brandUid));

        if (has) {
            spec = spec.and(ProductLineSpecification.hasProductUid(productUid));
        } else {
            spec = spec.and(ProductLineSpecification.notHaveProductUid(productUid));
        }

        // ✅ Bỏ product line mặc định
        spec = spec.and(ProductLineSpecification.isNotDefault());

        List<ProductLineDto> result = productLineRepository.findAll(spec)
                .stream()
                .map(productLineMapper::toDto)
                .toList();

        return new PageImpl<>(result);
    }

    @Transactional
    public void addProductLine(UUID uid, UUID productLineUid) {
        ProductEntity productEntity = getEntityByUid(uid);
        ProductLineEntity productLineEntity = productLineService.getEntityByUid(productLineUid);
        if (productEntity.getProductLines() == null)
            productEntity.setProductLines(new HashSet<>());
        if (!productEntity.getProductLines().contains(productLineEntity)) {
            productEntity.getProductLines().add(productLineEntity);
        }
        repository.save(productEntity);
    }

    @Transactional
    public void removeProductLine(UUID uid, UUID productLineUid) {
        ProductEntity productEntity = getEntityByUid(uid);
        ProductLineEntity productLineEntity = productLineService.getEntityByUid(productLineUid);

        if (Boolean.TRUE.equals(productLineEntity.getIsDefault())) {
            throw new IllegalStateException("Không thể xóa product line mặc định");
        }

        Set<ProductLineEntity> productLines = productEntity.getProductLines();
        if (productLines != null && productLines.contains(productLineEntity)) {
            productLines.remove(productLineEntity);
            repository.save(productEntity);
        }
    }

    // toan them
    public List<ProductEntity> getAllById(List<UUID> productUids) {
        if (productUids == null || productUids.isEmpty()) {
            return List.of();
        }
        return repository.findAllById(productUids);
    }
}
