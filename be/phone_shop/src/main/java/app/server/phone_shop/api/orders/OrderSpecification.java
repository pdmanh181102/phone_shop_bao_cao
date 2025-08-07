package app.server.phone_shop.api.orders;

import java.util.Set;

import org.springframework.data.jpa.domain.Specification;

import app.server.phone_shop.api.order_status.OrderStatusEnum;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class OrderSpecification {

    public static Specification<OrderEntity> hasStatus(Set<OrderStatusEnum> statuses) {
        return (root, query, cb) -> {
            if (statuses == null || statuses.isEmpty()) {
                return null;
            }
            return root.get("status").in(statuses);
        };
    }

    public static Specification<OrderEntity> search(String search) {
        return new Specification<OrderEntity>() {
            @Override
            public Predicate toPredicate(Root<OrderEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                if (search == null)
                    return null;
                return cb.like(
                        cb.lower(root.get("name")), "%" + search + "%");
            }
        };
    }

    public static Specification<OrderEntity> name(String name) {
        return new Specification<OrderEntity>() {
            @Override
            public Predicate toPredicate(Root<OrderEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                if (name == null)
                    return null;
                return cb.equal(
                        cb.lower(root.get("name")), name);
            }
        };
    }
}
