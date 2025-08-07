package app.server.phone_shop.api.inventory_export_items;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryExportItemRepository
                extends JpaRepository<InventoryExportItemEntity, UUID>,
                JpaSpecificationExecutor<InventoryExportItemEntity> {
}
