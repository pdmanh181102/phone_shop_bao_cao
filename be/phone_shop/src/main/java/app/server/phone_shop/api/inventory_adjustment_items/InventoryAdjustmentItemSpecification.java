package app.server.phone_shop.api.inventory_adjustment_items;

import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class InventoryAdjustmentItemSpecification {
    public static Specification<InventoryAdjustmentItemEntity> hasAdjustmentUid(UUID adjustmentUid) {
        return new Specification<InventoryAdjustmentItemEntity>() {
            @Override
            public Predicate toPredicate(Root<InventoryAdjustmentItemEntity> root, CriteriaQuery<?> query,
                    CriteriaBuilder cb) {
                if (adjustmentUid == null)
                    return null;
                return cb.equal(root.get("adjustment").get("uid"), adjustmentUid);
            }
        };
    }
}
