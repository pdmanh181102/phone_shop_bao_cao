package app.server.phone_shop.api.brands;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandRepository extends JpaRepository<BrandEntity, UUID>, JpaSpecificationExecutor<BrandEntity> {
    Optional<BrandEntity> findByName(String name);
}
