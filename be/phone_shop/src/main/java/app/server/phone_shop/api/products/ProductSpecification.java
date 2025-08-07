package app.server.phone_shop.api.products;

import java.util.Set;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import app.server.phone_shop.api.brands.BrandEntity;
import app.server.phone_shop.api.product_lines.ProductLineEntity;
import app.server.phone_shop.api.product_status.ProductStatusEnum;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class ProductSpecification {

    public static Specification<ProductEntity> hasProductUids(Set<UUID> productUids) {
        return new Specification<ProductEntity>() {
            @Override
            public Predicate toPredicate(Root<ProductEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                if (productUids == null)
                    return null;
                return root.get("uid").in(productUids);
            }
        };
    }

    public static Specification<ProductEntity> hasBrandUids(Set<UUID> brandUids) {
        return (root, query, cb) -> {
            if (brandUids == null || brandUids.isEmpty()) {
                return cb.conjunction(); // không lọc
            }

            // Join từ product → productLines
            Join<ProductEntity, ProductLineEntity> productLineJoin = root.join("productLines", JoinType.INNER);

            // Join tiếp → brand
            Join<ProductLineEntity, BrandEntity> brandJoin = productLineJoin.join("brand", JoinType.INNER);

            // Chỉ lọc productLine mặc định
            Predicate isDefault = cb.isTrue(productLineJoin.get("isDefault"));

            // brandUid nằm trong tập brandUids
            Predicate inBrands = brandJoin.get("uid").in(brandUids);

            return cb.and(isDefault, inBrands);
        };
    }

    public static Specification<ProductEntity> hasProductLineUids(Set<UUID> productLineUids) {
        return new Specification<ProductEntity>() {
            @Override
            public Predicate toPredicate(Root<ProductEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                if (productLineUids == null)
                    return null;
                return root.get("productLines").get("uid").in(productLineUids);
            }
        };
    }

    public static Specification<ProductEntity> hasStatus(Set<ProductStatusEnum> statuses) {
        return (root, query, cb) -> {
            if (statuses == null || statuses.isEmpty()) {
                return null;
            }
            return root.get("status").in(statuses);
        };
    }

    public static Specification<ProductEntity> search(String search) {
        return new Specification<ProductEntity>() {
            @Override
            public Predicate toPredicate(Root<ProductEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                if (search == null)
                    return null;
                return cb.like(
                        cb.lower(root.get("name")), "%" + search + "%");
            }
        };
    }

    public static Specification<ProductEntity> name(String name) {
        return new Specification<ProductEntity>() {
            @Override
            public Predicate toPredicate(Root<ProductEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                if (name == null)
                    return null;
                return cb.equal(
                        cb.lower(root.get("name")), name);
            }
        };
    }
}
