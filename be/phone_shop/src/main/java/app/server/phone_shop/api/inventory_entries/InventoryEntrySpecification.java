package app.server.phone_shop.api.inventory_entries;

import org.springframework.data.jpa.domain.Specification;

import app.server.phone_shop.api.inventory_entry_types.InventoryEntryTypeEnum;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class InventoryEntrySpecification {
    public static Specification<InventoryEntryEntity> type(InventoryEntryTypeEnum type) {
        return new Specification<InventoryEntryEntity>() {
            @Override
            public Predicate toPredicate(Root<InventoryEntryEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                if (type == null)
                    return null;
                return cb.equal(root.get("type"), type);
            }
        };
    }
}
