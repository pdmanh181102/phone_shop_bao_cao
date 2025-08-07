package app.server.phone_shop.api.inventory_export_items;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InventoryExportItemService {

    private final InventoryExportItemRepository repository;
    private final InventoryExportItemMapper mapper;

    public List<InventoryExportItemDto> getAll(UUID exportUid) {

        Specification<InventoryExportItemEntity> spec = Specification.where(null);
        spec = spec.and(InventoryExportItemSpecification.hasExportUid(exportUid));

        List<InventoryExportItemDto> result = repository.findAll(spec)
                .stream()
                .map(mapper::toDto)
                .toList();
        return result;
    }

}
