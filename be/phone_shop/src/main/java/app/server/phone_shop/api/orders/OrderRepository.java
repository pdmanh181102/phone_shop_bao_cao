package app.server.phone_shop.api.orders;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import app.server.phone_shop.api.analysis.dto.SummaryDto;

@Repository
public interface OrderRepository
                extends JpaRepository<OrderEntity, UUID>, JpaSpecificationExecutor<OrderEntity> {
        @Query("SELECT o.status, COUNT(o) FROM OrderEntity o GROUP BY o.status")
        List<Object[]> countByStatus();

        @Query("SELECT COUNT(p) FROM OrderEntity p")
        Integer countAll();

        @Query("""
                            SELECT o.createdAt, SUM(o.totalAmount + o.shippingAmount)
                            FROM OrderEntity o
                            WHERE (:startDate IS NULL OR o.createdAt >= :startDate)
                              AND (:endDate IS NULL OR o.createdAt <= :endDate)
                            GROUP BY o.createdAt
                            ORDER BY o.createdAt
                        """)
        List<Object[]> getOrderSummariesRaw(
                        @Param("startDate") Instant startDate,
                        @Param("endDate") Instant endDate);
}
