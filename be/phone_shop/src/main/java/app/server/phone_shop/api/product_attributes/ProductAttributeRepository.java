package app.server.phone_shop.api.product_attributes;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductAttributeRepository
        extends JpaRepository<ProductAttributeEntity, UUID>, JpaSpecificationExecutor<ProductAttributeEntity> {
    Optional<ProductAttributeEntity> findByNameAndProductUid(String name, UUID productUId);

    List<ProductAttributeEntity> findAllByProduct_Uid(UUID productUid);

    List<ProductAttributeEntity> findAllByProductUidIn(List<UUID> productUids);
}
