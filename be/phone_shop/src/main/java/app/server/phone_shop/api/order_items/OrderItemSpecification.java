package app.server.phone_shop.api.order_items;

import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class OrderItemSpecification {
    public static Specification<OrderItemEntity> hasOrderUid(UUID orderUid) {
        return new Specification<OrderItemEntity>() {
            @Override
            public Predicate toPredicate(Root<OrderItemEntity> root, CriteriaQuery<?> query,
                    CriteriaBuilder cb) {
                if (orderUid == null)
                    return null;
                return cb.equal(root.get("order").get("uid"), orderUid);
            }
        };
    }
}
