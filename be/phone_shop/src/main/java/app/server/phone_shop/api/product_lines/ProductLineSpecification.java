package app.server.phone_shop.api.product_lines;

import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import app.server.phone_shop.api.products.ProductEntity;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

public class ProductLineSpecification {

    public static Specification<ProductLineEntity> isNotDefault() {
        return (root, query, cb) -> cb.isFalse(root.get("isDefault"));
    }

    public static Specification<ProductLineEntity> isDefaultOfBrand(UUID brandUid) {
        return (root, query, cb) -> cb.and(
                cb.equal(root.get("brand").get("uid"), brandUid),
                cb.isTrue(root.get("isDefault")));
    }

    public static Specification<ProductLineEntity> hasBrandUid(UUID brandUid) {
        return new Specification<ProductLineEntity>() {
            @Override
            public Predicate toPredicate(Root<ProductLineEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                if (brandUid == null)
                    return null;
                return cb.equal(root.get("brand").get("uid"), brandUid);
            }
        };
    }

    public static Specification<ProductLineEntity> notHaveProductUid(UUID productUid) {
        return (root, query, cb) -> {
            if (productUid == null)
                return null;

            // Subquery để tìm các ProductLineEntity CÓ liên kết với productUid
            Subquery<UUID> subquery = query.subquery(UUID.class);
            Root<ProductLineEntity> subRoot = subquery.from(ProductLineEntity.class);
            Join<ProductLineEntity, ProductEntity> joinProducts = subRoot.join("products");

            subquery.select(subRoot.get("uid"))
                    .where(cb.equal(joinProducts.get("uid"), productUid));

            // Lọc những productLine không nằm trong subquery đó
            return cb.not(root.get("uid").in(subquery));
        };
    }

    public static Specification<ProductLineEntity> hasProductUid(UUID productUid) {
        return (root, query, cb) -> {
            if (productUid == null)
                return null;

            // Join từ ProductLineEntity sang ProductEntity qua quan hệ many-to-many
            Join<ProductLineEntity, ProductEntity> productsJoin = root.join("products");

            // So sánh uid
            return cb.equal(productsJoin.get("uid"), productUid);
        };
    }

    public static Specification<ProductLineEntity> search(String search) {
        return new Specification<ProductLineEntity>() {
            @Override
            public Predicate toPredicate(Root<ProductLineEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                if (search == null)
                    return null;
                return cb.like(
                        cb.lower(root.get("name")), "%" + search + "%");
            }
        };
    }

    public static Specification<ProductLineEntity> name(String name) {
        return new Specification<ProductLineEntity>() {
            @Override
            public Predicate toPredicate(Root<ProductLineEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                if (name == null)
                    return null;
                return cb.equal(
                        cb.lower(root.get("name")), name);
            }
        };
    }
}
