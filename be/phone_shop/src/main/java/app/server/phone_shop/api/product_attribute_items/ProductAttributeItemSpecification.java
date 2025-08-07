package app.server.phone_shop.api.product_attribute_items;

import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class ProductAttributeItemSpecification {

    public static Specification<ProductAttributeItemEntity> hasAttributeUid(UUID attributeUid) {
        return new Specification<ProductAttributeItemEntity>() {
            @Override
            public Predicate toPredicate(Root<ProductAttributeItemEntity> root, CriteriaQuery<?> query,
                    CriteriaBuilder cb) {
                if (attributeUid == null)
                    return null;
                return cb.equal(root.get("attribute").get("uid"), attributeUid);
            }
        };
    }
}
