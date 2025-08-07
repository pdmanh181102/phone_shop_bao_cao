package app.server.phone_shop.api.inventory_receipts;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryReceiptRepository
    extends JpaRepository<InventoryReceiptEntity, UUID>, JpaSpecificationExecutor<InventoryReceiptEntity> {
  Optional<InventoryReceiptEntity> findByEntry_Uid(UUID entryUid);
  // @Query("""
  // SELECT new app.server.phone_shop.api.analysis.dto.SummaryDto(
  // o.createdAt,
  // SUM(oi.quantity),
  // SUM(oi.unitPrice * oi.quantity)
  // )
  // FROM InventoryEntryEntity o
  // JOIN o.items oi
  // WHERE (:startDate IS NULL OR o.createdAt >= :startDate)
  // AND (:endDate IS NULL OR o.createdAt <= :endDate)
  // GROUP BY o.createdAt
  // ORDER BY o.createdAt
  // """)
  // List<SummaryDto> getEntrySummaries(
  // @Param("startDate") Instant startDate,
  // @Param("endDate") Instant endDate);
}
