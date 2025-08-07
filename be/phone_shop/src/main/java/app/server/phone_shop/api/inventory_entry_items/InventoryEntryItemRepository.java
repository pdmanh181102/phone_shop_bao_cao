package app.server.phone_shop.api.inventory_entry_items;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryEntryItemRepository
        extends JpaRepository<InventoryEntryItemEntity, UUID>, JpaSpecificationExecutor<InventoryEntryItemEntity> {
}
