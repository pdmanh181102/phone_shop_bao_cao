package app.server.phone_shop.api.inventory_entries;

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
public interface InventoryEntryRepository
                extends JpaRepository<InventoryEntryEntity, UUID>, JpaSpecificationExecutor<InventoryEntryEntity> {

        @Query("""
                        SELECT new app.server.phone_shop.api.analysis.dto.SummaryDto(
                            o.createdAt,
                            SUM(oi.quantity),
                            SUM(oi.unitPrice * oi.quantity)
                        )
                        FROM InventoryEntryEntity o
                        JOIN o.items oi
                        WHERE (:startDate IS NULL OR o.createdAt >= :startDate)
                          AND (:endDate IS NULL OR o.createdAt <= :endDate)
                        GROUP BY o.createdAt
                        ORDER BY o.createdAt
                        """)
        List<SummaryDto> getEntrySummaries(
                        @Param("startDate") Instant startDate,
                        @Param("endDate") Instant endDate);
}
