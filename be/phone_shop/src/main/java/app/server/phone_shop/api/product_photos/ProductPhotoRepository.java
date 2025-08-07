package app.server.phone_shop.api.product_photos;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductPhotoRepository
        extends JpaRepository<ProductPhotoEntity, UUID>, JpaSpecificationExecutor<ProductPhotoEntity> {
    @Modifying
    @Query("UPDATE ProductPhotoEntity p SET p.isDefault = false WHERE p.product.uid = :productUid")
    void clearDefaultForProduct(@Param("productUid") UUID productUid);

    @Query("SELECT p FROM ProductPhotoEntity p WHERE p.product.uid = :productUid AND p.isDefault = true")
    Optional<ProductPhotoEntity> findDefaultPhotoByProductUid(@Param("productUid") UUID productUid);
}
