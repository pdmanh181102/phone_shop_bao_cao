package app.server.phone_shop.api.inventory_exports;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryExportRepository
        extends JpaRepository<InventoryExportEntity, UUID>, JpaSpecificationExecutor<InventoryExportEntity> {
}
