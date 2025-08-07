package app.server.phone_shop.api.suppliers;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepository
        extends JpaRepository<SupplierEntity, UUID>, JpaSpecificationExecutor<SupplierEntity> {
    Optional<SupplierEntity> findByName(String name);
}
