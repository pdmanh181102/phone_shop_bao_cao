package app.server.phone_shop.api.inventory_exports;

import org.springframework.data.jpa.domain.Specification;

import app.server.phone_shop.api.inventory_entry_types.InventoryEntryTypeEnum;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class InventoryExportSpecification {
    public static Specification<InventoryExportEntity> type(InventoryEntryTypeEnum type) {
        return new Specification<InventoryExportEntity>() {
            @Override
            public Predicate toPredicate(Root<InventoryExportEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                if (type == null)
                    return null;
                return cb.equal(root.get("type"), type);
            }
        };
    }
}
