package app.server.phone_shop.api.product_photos;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import app.server.phone_shop.api.products.ProductEntity;
import app.server.phone_shop.api.products.ProductService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Transactional
@Service
@RequiredArgsConstructor
public class ProductPhotoService {

    private final ProductPhotoRepository repository;
    private final ProductPhotoMapper mapper;

    private final ProductService productService;

    public ProductPhotoDto getProductAvatar(UUID productUid) {
        ProductPhotoEntity entity = repository.findDefaultPhotoByProductUid(productUid).orElse(null);
        return mapper.toDto(entity);
    }

    public ProductPhotoDto create(UUID productUid, String photoUrl) {
        ProductEntity product = productService.getEntityByUid(productUid);
        ProductPhotoEntity entity = ProductPhotoEntity.builder().product(product).photoUrl(photoUrl).build();
        return mapper.toDto(repository.save(entity));
    }

    private ProductPhotoEntity getEntityByUid(UUID uid) {
        ProductPhotoEntity entity = repository.findById(uid).orElseThrow(() -> new EntityNotFoundException());
        return entity;
    }

    public Page<ProductPhotoDto> getAll(UUID productUid, Integer page,
            Integer size,
            String sort, String search) {
        String[] sortParts = (sort != null) ? sort.split(",") : new String[] { "id" };
        String sortBy = sortParts[0];
        Sort.Direction direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("desc"))
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        Sort sortObj = Sort.by(direction, sortBy);

        Specification<ProductPhotoEntity> spec = Specification.where(null);
        spec = spec.and(ProductPhotoSpecification.hasProductUid(productUid));

        // Nếu page hoặc size null -> không phân trang, trả toàn bộ danh sách
        if (page == null || size == null) {
            List<ProductPhotoDto> result = repository.findAll(spec, sortObj)
                    .stream()
                    .map(mapper::toDto)
                    .toList();
            return new PageImpl<>(result); // Chuyển về Page để giữ kiểu trả về
        }

        // Có phân trang
        page = Math.max(page, 0);
        size = Math.max(size, 1);
        Pageable pageable = PageRequest.of(page, size, sortObj);

        Page<ProductPhotoEntity> attributePage = repository.findAll(spec, pageable);

        return attributePage.map(mapper::toDto);
    }

    public ProductPhotoDto setDefault(UUID uid) {
        ProductPhotoEntity entity = getEntityByUid(uid);
        UUID productUid = entity.getProduct().getUid();
        repository.clearDefaultForProduct(productUid);
        entity.setIsDefault(true);
        repository.save(entity);
        return mapper.toDto(entity);
    }

    public ProductPhotoDto deleteByUid(UUID uid) {
        ProductPhotoEntity attribute = getEntityByUid(uid);
        repository.delete(attribute);
        return mapper.toDto(attribute);
    }

}
