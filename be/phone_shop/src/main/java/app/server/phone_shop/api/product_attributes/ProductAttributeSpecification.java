package app.server.phone_shop.api.product_attributes;

import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class ProductAttributeSpecification {

    public static Specification<ProductAttributeEntity> hasProductUid(UUID productUid) {
        return new Specification<ProductAttributeEntity>() {
            @Override
            public Predicate toPredicate(Root<ProductAttributeEntity> root, CriteriaQuery<?> query,
                    CriteriaBuilder cb) {
                if (productUid == null)
                    return null;
                return cb.equal(root.get("product").get("uid"), productUid);
            }
        };
    }

    public static Specification<ProductAttributeEntity> search(String search) {
        return new Specification<ProductAttributeEntity>() {
            @Override
            public Predicate toPredicate(Root<ProductAttributeEntity> root, CriteriaQuery<?> query,
                    CriteriaBuilder cb) {
                if (search == null)
                    return null;
                return cb.like(
                        cb.lower(root.get("name")), "%" + search + "%");
            }
        };
    }

    public static Specification<ProductAttributeEntity> name(String name) {
        return new Specification<ProductAttributeEntity>() {
            @Override
            public Predicate toPredicate(Root<ProductAttributeEntity> root, CriteriaQuery<?> query,
                    CriteriaBuilder cb) {
                if (name == null)
                    return null;
                return cb.equal(
                        cb.lower(root.get("name")), name);
            }
        };
    }
}
