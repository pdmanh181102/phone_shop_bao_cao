package app.server.phone_shop.api.product_lines;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductLineRepository
        extends JpaRepository<ProductLineEntity, UUID>, JpaSpecificationExecutor<ProductLineEntity> {
    Optional<ProductLineEntity> findByNameAndBrandUid(String name, UUID brandUid);
}
