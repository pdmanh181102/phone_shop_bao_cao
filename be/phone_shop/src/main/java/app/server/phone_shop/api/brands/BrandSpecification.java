package app.server.phone_shop.api.brands;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class BrandSpecification {
    public static Specification<BrandEntity> search(String search) {
        return new Specification<BrandEntity>() {
            @Override
            public Predicate toPredicate(Root<BrandEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                if (search == null)
                    return null;
                return cb.like(
                        cb.lower(root.get("name")), "%" + search + "%");
            }
        };
    }

    public static Specification<BrandEntity> name(String name) {
        return new Specification<BrandEntity>() {
            @Override
            public Predicate toPredicate(Root<BrandEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                if (name == null)
                    return null;
                return cb.equal(
                        cb.lower(root.get("name")), name);
            }
        };
    }
}
