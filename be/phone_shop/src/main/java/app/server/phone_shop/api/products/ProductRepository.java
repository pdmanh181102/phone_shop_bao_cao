package app.server.phone_shop.api.products;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository
        extends JpaRepository<ProductEntity, UUID>, JpaSpecificationExecutor<ProductEntity> {
    Optional<ProductEntity> findByName(String name);

    @Query("SELECT p.status, COUNT(p) FROM ProductEntity p GROUP BY p.status")
    List<Object[]> countByStatus();

    @Query("SELECT COUNT(p) FROM ProductEntity p")
    Integer countAll();
}
