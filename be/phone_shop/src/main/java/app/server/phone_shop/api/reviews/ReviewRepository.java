package app.server.phone_shop.api.reviews;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<ReviewEntity, UUID> {
    Optional<ReviewEntity> findByOrderItem_Uid(UUID orderItemUid);

    boolean existsByOrderItem_Uid(UUID orderItemUid);

    List<ReviewEntity> findAllByOrderItem_Product_Uid(UUID productUid);

    @Query("SELECT AVG(r.star) FROM ReviewEntity r WHERE r.orderItem.product.uid = :productUid")
    Float calculateAverageStarByProductUid(@Param("productUid") UUID productUid);

    @Query("""
            SELECT r
            FROM ReviewEntity r
            JOIN r.orderItem oi
            WHERE oi.product.uid = :productUid
            """)
    List<ReviewEntity> findAllByProductUid(@Param("productUid") UUID productUid);

}
