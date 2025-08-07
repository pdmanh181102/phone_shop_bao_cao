package app.server.phone_shop.api.product_attribute_items;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductAttributeItemRepository
        extends JpaRepository<ProductAttributeItemEntity, UUID>, JpaSpecificationExecutor<ProductAttributeItemEntity> {
}
