package app.server.phone_shop.api.inventory_entries;

import java.math.BigDecimal;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import app.server.phone_shop.api.inventory_entries.request_dto.CreateEntryItemDto;
import app.server.phone_shop.api.inventory_entry_items.InventoryEntryItemEntity;
import app.server.phone_shop.api.products.ProductEntity;
import app.server.phone_shop.api.products.ProductRepository;
import app.server.phone_shop.api.suppliers.SupplierService;
import app.server.phone_shop.api.users.UserEntity;
import app.server.phone_shop.api.users.UserService;
import app.server.phone_shop.core.auth.AuthService;
import app.server.phone_shop.core.auth.AuthType;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InventoryEntryService {

    private final InventoryEntryRepository repository;
    private final InventoryEntryMapper mapper;
    private final ProductRepository productRepository;
    private final UserService userService;

    private final SupplierService supplierService;

    private final AuthService authService;

    @Transactional
    public InventoryEntryDto create(UUID supplierUid, String reason, Set<CreateEntryItemDto> items) {
        try {

            String personType = authService.getCurrentUserType();
            if (personType != AuthType.STAFF) {
                throw new RuntimeException("Tài khoản không phải staff");
            }

            UUID userUid = authService.getCurrentUserUid();
            if (userUid == null) {
                throw new RuntimeException("Mã nhân viên không hợp lệ!");
            }

            UserEntity userEntity = userService.getEntityByUid(userUid);

            InventoryEntryEntity entry = InventoryEntryEntity.builder()
                    .supplier(supplierService.getEntityByUid(supplierUid))
                    .reason(reason)
                    .staff(userEntity)
                    .build();

            List<InventoryEntryItemEntity> entryItems = new LinkedList<>();

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
                        .entry(entry)
                        .build();

                // productEntity.setEnteredQuantity(productEntity.getEnteredQuantity() +
                // quantity);
                // productEntity.setCurrentQuantity(productEntity.getCurrentQuantity() +
                // quantity);
                // productRepository.save(productEntity);

                entryItems.add(entryItem);
            }

            entry.setItems(entryItems);
            repository.save(entry);

            return mapper.toDto(entry);
        } catch (Exception e) {
            throw e;
        }
    }

    public InventoryEntryDto getByUid(UUID uid) {
        InventoryEntryEntity entity = getEntityByUid(uid);
        return mapper.toDto(entity);
    }

    public InventoryEntryEntity getEntityByUid(UUID uid) {
        InventoryEntryEntity entity = repository.findById(uid).orElseThrow(() -> new EntityNotFoundException());
        return entity;
    }

    public Page<InventoryEntryDto> getAll(Integer page, Integer size, String sort) {
        String[] sortParts = (sort != null) ? sort.split(",") : new String[] { "id" };
        String sortBy = sortParts[0];
        Sort.Direction direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("desc"))
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        Sort sortObj = Sort.by(direction, sortBy);

        // Nếu page hoặc size null -> không phân trang, trả toàn bộ danh sách
        if (page == null || size == null) {
            List<InventoryEntryDto> result = repository.findAll(sortObj)
                    .stream()
                    .map(mapper::toDto)
                    .toList();
            return new PageImpl<>(result); // Chuyển về Page để giữ kiểu trả về
        }

        // Có phân trang
        page = Math.max(page, 0);
        size = Math.max(size, 1);
        Pageable pageable = PageRequest.of(page, size, sortObj);

        Page<InventoryEntryEntity> brandPage = repository.findAll(pageable);
        return brandPage.map(mapper::toDto);
    }

    public InventoryEntryDto deleteByUid(UUID uid) {
        InventoryEntryEntity brand = getEntityByUid(uid);
        repository.delete(brand);
        return mapper.toDto(brand);
    }
}
