package app.server.phone_shop.api.inventory_adjustment;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryAdjustmentRepository
        extends JpaRepository<InventoryAdjustmentEntity, UUID>, JpaSpecificationExecutor<InventoryAdjustmentEntity> {
}
