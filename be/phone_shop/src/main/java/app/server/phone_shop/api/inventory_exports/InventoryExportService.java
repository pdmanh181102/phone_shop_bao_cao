package app.server.phone_shop.api.inventory_exports;

import java.math.BigDecimal;
import java.util.ArrayList;
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

import app.server.phone_shop.api.inventory_entries.request_dto.CreateEntryItemDto;
import app.server.phone_shop.api.inventory_entry_items.InventoryEntryItemEntity;
import app.server.phone_shop.api.inventory_entry_types.InventoryEntryTypeEnum;
import app.server.phone_shop.api.products.ProductEntity;
import app.server.phone_shop.api.products.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InventoryExportService {

    private final InventoryExportRepository repository;
    private final InventoryExportMapper mapper;
    private final ProductRepository productRepository;

    @Transactional
    public InventoryExportDto create(
            UUID supplierUid, String reason,
            Set<CreateEntryItemDto> items) {
        try {
            // Tạo entity
            InventoryExportEntity entry = InventoryExportEntity.builder()
                    .reason(reason)
                    .build();

            // Khởi tạo list
            List<InventoryEntryItemEntity> entryItems = new ArrayList<>();

            for (CreateEntryItemDto item : items) {
                UUID productUid = item.getProductUid();
                int quantity = item.getQuantity();
                BigDecimal unitPrice = item.getUnitPrice();

                ProductEntity productEntity = productRepository.findById(productUid)
                        .orElseThrow(() -> new EntityNotFoundException("Product entity not found"));

                InventoryEntryItemEntity entryItem = InventoryEntryItemEntity.builder()
                        .product(productEntity)
                        .quantity(quantity)
                        .unitPrice(unitPrice)
                        .build();

                // update product quantity
                productEntity.setEnteredQuantity(productEntity.getEnteredQuantity() + quantity);

                productRepository.save(productEntity);

                entryItems.add(entryItem);
            }

            repository.save(entry); // cascade sẽ tự lưu item

            return mapper.toDto(entry); // hoặc trả null nếu chưa cần
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public InventoryExportDto getByUid(UUID uid) {
        InventoryExportEntity entity = getEntityByUid(uid);
        return mapper.toDto(entity);
    }

    public InventoryExportEntity getEntityByUid(UUID uid) {
        InventoryExportEntity entity = repository.findById(uid).orElseThrow(() -> new EntityNotFoundException());
        return entity;
    }

    public Page<InventoryExportDto> getAll(InventoryEntryTypeEnum type, Integer page, Integer size, String sort) {
        String[] sortParts = (sort != null) ? sort.split(",") : new String[] { "id" };
        String sortBy = sortParts[0];
        Sort.Direction direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("desc"))
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        Sort sortObj = Sort.by(direction, sortBy);

        Specification<InventoryExportEntity> spec = Specification.where(null);
        spec = spec.and(InventoryExportSpecification.type(type));

        // Nếu page hoặc size null -> không phân trang, trả toàn bộ danh sách
        if (page == null || size == null) {
            List<InventoryExportDto> result = repository.findAll(spec, sortObj)
                    .stream()
                    .map(mapper::toDto)
                    .toList();
            return new PageImpl<>(result); // Chuyển về Page để giữ kiểu trả về
        }

        // Có phân trang
        page = Math.max(page, 0);
        size = Math.max(size, 1);
        Pageable pageable = PageRequest.of(page, size, sortObj);

        Page<InventoryExportEntity> brandPage = repository.findAll(spec, pageable);
        return brandPage.map(mapper::toDto);
    }

    public InventoryExportDto deleteByUid(UUID uid) {
        InventoryExportEntity brand = getEntityByUid(uid);
        repository.delete(brand);
        return mapper.toDto(brand);
    }
}
