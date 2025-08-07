package app.server.phone_shop.api.inventory_receipts;

import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class InventoryReceiptSpecification {
    public static Specification<InventoryReceiptEntity> hasEntryUid(UUID entryUid) {
        return new Specification<InventoryReceiptEntity>() {
            @Override
            public Predicate toPredicate(Root<InventoryReceiptEntity> root, CriteriaQuery<?> query,
                    CriteriaBuilder cb) {
                if (entryUid == null)
                    return null;
                return cb.equal(root.get("entry").get("uid"), entryUid);
            }
        };
    }
}
