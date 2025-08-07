package app.server.phone_shop.api.customers;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface CustomerRepository
        extends JpaRepository<CustomerEntity, UUID>, JpaSpecificationExecutor<CustomerEntity> {
    Optional<CustomerEntity> findByUsername(String username);

    Optional<CustomerEntity> findByEmail(String email);

    boolean existsByUsername(String username);

    @Query("SELECT COUNT(p) FROM CustomerEntity p")
    Integer countAll();
}