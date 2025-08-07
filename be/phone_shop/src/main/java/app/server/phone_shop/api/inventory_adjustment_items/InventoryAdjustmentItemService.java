package app.server.phone_shop.api.inventory_adjustment_items;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InventoryAdjustmentItemService {

    private final InventoryAdjustmentItemRepository repository;
    private final InventoryAdjustmentItemMapper mapper;

    public List<InventoryAdjustmentItemDto> getAll(UUID adjustmentUid) {

        Specification<InventoryAdjustmentItemEntity> spec = Specification.where(null);
        spec = spec.and(InventoryAdjustmentItemSpecification.hasAdjustmentUid(adjustmentUid));

        List<InventoryAdjustmentItemDto> result = repository.findAll(spec)
                .stream()
                .map(mapper::toDto)
                .toList();
        return result;
    }

}
