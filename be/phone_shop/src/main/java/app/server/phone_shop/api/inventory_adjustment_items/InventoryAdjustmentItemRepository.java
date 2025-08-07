package app.server.phone_shop.api.inventory_adjustment_items;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryAdjustmentItemRepository
                extends JpaRepository<InventoryAdjustmentItemEntity, UUID>,
                JpaSpecificationExecutor<InventoryAdjustmentItemEntity> {
}
