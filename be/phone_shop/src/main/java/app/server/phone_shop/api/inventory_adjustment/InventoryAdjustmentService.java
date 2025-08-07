package app.server.phone_shop.api.inventory_adjustment;

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

import app.server.phone_shop.api.inventory_adjustment.request_dto.CreateAdjustmentItemDto;
import app.server.phone_shop.api.inventory_adjustment_items.InventoryAdjustmentItemEntity;
import app.server.phone_shop.api.products.ProductEntity;
import app.server.phone_shop.api.products.ProductRepository;
import app.server.phone_shop.api.users.UserEntity;
import app.server.phone_shop.api.users.UserService;
import app.server.phone_shop.core.auth.AuthService;
import app.server.phone_shop.core.auth.AuthType;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InventoryAdjustmentService {

    private final InventoryAdjustmentRepository repository;
    private final InventoryAdjustmentMapper mapper;
    private final ProductRepository productRepository;
    private final UserService userService;
    private final AuthService authService;

    @Transactional
    public InventoryAdjustmentEntryDto create(String reason,
            Set<CreateAdjustmentItemDto> items) {
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

            // Tạo entity
            InventoryAdjustmentEntity adjustment = InventoryAdjustmentEntity.builder()
                    .reason(reason)
                    .staff(userEntity)
                    .build();

            // Khởi tạo list
            List<InventoryAdjustmentItemEntity> adjustmentItems = new ArrayList<>();

            for (CreateAdjustmentItemDto item : items) {
                UUID productUid = item.getProductUid();
                int quantity = item.getQuantity();

                if (quantity < 0)
                    throw new RuntimeException("quanity must grethan zero");

                ProductEntity productEntity = productRepository.findById(productUid)
                        .orElseThrow(() -> new EntityNotFoundException("Product entity not found"));
                Integer currentQuantity = productEntity.getCurrentQuantity();

                InventoryAdjustmentItemEntity entryItem = InventoryAdjustmentItemEntity.builder()
                        .product(productEntity)
                        .adjustment(adjustment)
                        .beforeQuantity(currentQuantity)
                        .quantity(quantity)
                        .build();

                // update product adjustment quantity
                productEntity.setCurrentQuantity(quantity);
                productRepository.save(productEntity);
                adjustmentItems.add(entryItem);
            }

            adjustment.setItems(adjustmentItems); // gán toàn bộ list
            repository.save(adjustment); // cascade sẽ tự lưu item

            return mapper.toDto(adjustment); // hoặc trả null nếu chưa cần
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public InventoryAdjustmentEntryDto getByUid(UUID uid) {
        InventoryAdjustmentEntity entity = getEntityByUid(uid);
        return mapper.toDto(entity);
    }

    public InventoryAdjustmentEntity getEntityByUid(UUID uid) {
        InventoryAdjustmentEntity entity = repository.findById(uid).orElseThrow(() -> new EntityNotFoundException());
        return entity;
    }

    public Page<InventoryAdjustmentEntryDto> getAll(Integer page, Integer size,
            String sort) {
        String[] sortParts = (sort != null) ? sort.split(",") : new String[] { "id" };
        String sortBy = sortParts[0];
        Sort.Direction direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("desc"))
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        Sort sortObj = Sort.by(direction, sortBy);

        Specification<InventoryAdjustmentEntity> spec = Specification.where(null);

        // Nếu page hoặc size null -> không phân trang, trả toàn bộ danh sách
        if (page == null || size == null) {
            List<InventoryAdjustmentEntryDto> result = repository.findAll(spec, sortObj)
                    .stream()
                    .map(mapper::toDto)
                    .toList();
            return new PageImpl<>(result); // Chuyển về Page để giữ kiểu trả về
        }

        // Có phân trang
        page = Math.max(page, 0);
        size = Math.max(size, 1);
        Pageable pageable = PageRequest.of(page, size, sortObj);

        Page<InventoryAdjustmentEntity> brandPage = repository.findAll(spec, pageable);
        return brandPage.map(mapper::toDto);
    }

    public InventoryAdjustmentEntryDto deleteByUid(UUID uid) {
        InventoryAdjustmentEntity brand = getEntityByUid(uid);
        repository.delete(brand);
        return mapper.toDto(brand);
    }
}
