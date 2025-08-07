package app.server.phone_shop.api.inventory_exports;

import java.util.List;
import java.util.UUID;

import app.server.phone_shop.api.inventory_export_items.InventoryExportItemEntity;
import app.server.phone_shop.api.orders.OrderEntity;
import app.server.phone_shop.core.audit.AuditEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "inventory_exports")
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
@Builder
public class InventoryExportEntity extends AuditEntity {
    @Id
    @GeneratedValue(generator = "UUID")
    @Column
    private UUID uid;

    @Column(nullable = false, columnDefinition = "NVARCHAR(100)")
    private String reason;

    @OneToMany(mappedBy = "export", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InventoryExportItemEntity> items;

    @OneToOne
    @JoinColumn(name = "order_uid", nullable = true)
    private OrderEntity order;
}
