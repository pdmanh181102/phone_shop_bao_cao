package app.server.phone_shop.api.inventory_export_items;

import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class InventoryExportItemSpecification {
    public static Specification<InventoryExportItemEntity> hasExportUid(UUID entryUid) {
        return new Specification<InventoryExportItemEntity>() {
            @Override
            public Predicate toPredicate(Root<InventoryExportItemEntity> root, CriteriaQuery<?> query,
                    CriteriaBuilder cb) {
                if (entryUid == null)
                    return null;
                return cb.equal(root.get("export").get("uid"), entryUid);
            }
        };
    }
}
