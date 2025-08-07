package app.server.phone_shop.api.order_items;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository
        extends JpaRepository<OrderItemEntity, UUID>,
        JpaSpecificationExecutor<OrderItemEntity> {
}
