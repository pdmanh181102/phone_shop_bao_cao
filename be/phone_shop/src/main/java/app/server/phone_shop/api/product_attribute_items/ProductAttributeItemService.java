package app.server.phone_shop.api.product_attribute_items;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductAttributeItemService {

    private final ProductAttributeItemRepository repository;
    private final ProductAttributeItemMapper mapper;

    public List<ProductAttributeItemDto> getAllByAttributeUid(UUID attributeUid) {

        try {
            Specification<ProductAttributeItemEntity> spec = Specification.where(null);
            spec = spec.and(ProductAttributeItemSpecification.hasAttributeUid(attributeUid));

            Sort sortObj = Sort.by(Sort.Direction.ASC, "value");

            return repository.findAll(spec, sortObj)
                    .stream()
                    .map(mapper::toDto)
                    .toList();
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

}
