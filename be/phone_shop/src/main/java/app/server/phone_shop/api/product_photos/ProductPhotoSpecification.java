package app.server.phone_shop.api.product_photos;

import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class ProductPhotoSpecification {

    public static Specification<ProductPhotoEntity> hasProductUid(UUID productUid) {
        return new Specification<ProductPhotoEntity>() {
            @Override
            public Predicate toPredicate(Root<ProductPhotoEntity> root, CriteriaQuery<?> query,
                    CriteriaBuilder cb) {
                if (productUid == null)
                    return null;
                return cb.equal(root.get("product").get("uid"), productUid);
            }
        };
    }

    public static Specification<ProductPhotoEntity> search(String search) {
        return new Specification<ProductPhotoEntity>() {
            @Override
            public Predicate toPredicate(Root<ProductPhotoEntity> root, CriteriaQuery<?> query,
                    CriteriaBuilder cb) {
                if (search == null)
                    return null;
                return cb.like(
                        cb.lower(root.get("photoUrl")), "%" + search + "%");
            }
        };
    }

    public static Specification<ProductPhotoEntity> name(String name) {
        return new Specification<ProductPhotoEntity>() {
            @Override
            public Predicate toPredicate(Root<ProductPhotoEntity> root, CriteriaQuery<?> query,
                    CriteriaBuilder cb) {
                if (name == null)
                    return null;
                return cb.equal(
                        cb.lower(root.get("name")), name);
            }
        };
    }
}
