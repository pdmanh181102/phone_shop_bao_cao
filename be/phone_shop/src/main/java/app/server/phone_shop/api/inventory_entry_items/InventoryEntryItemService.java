package app.server.phone_shop.api.inventory_entry_items;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InventoryEntryItemService {

    private final InventoryEntryItemRepository repository;
    private final InventoryEntryItemMapper mapper;

    public List<InventoryEntryItemDto> getAll(UUID entryUid) {

        Specification<InventoryEntryItemEntity> spec = Specification.where(null);
        spec = spec.and(InventoryEntryItemSpecification.hasEntryUid(entryUid));

        List<InventoryEntryItemDto> result = repository.findAll(spec)
                .stream()
                .map(mapper::toDto)
                .toList();
        return result;
    }

    public InventoryEntryItemEntity getEntityByUid(UUID uid) {
        return repository.findById(uid).orElseThrow(() -> new RuntimeException("entry item không tồn tại!"));
    }
}
