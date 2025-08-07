package app.server.phone_shop.api.inventory_adjustment;

import java.util.List;
import java.util.UUID;

import app.server.phone_shop.api.inventory_adjustment_items.InventoryAdjustmentItemEntity;
import app.server.phone_shop.api.users.UserEntity;
import app.server.phone_shop.core.audit.AuditEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "inventory_adjustments")
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
@Builder
public class InventoryAdjustmentEntity extends AuditEntity {
    @Id
    @GeneratedValue(generator = "UUID")
    @Column
    private UUID uid;

    @Column(nullable = false, columnDefinition = "NVARCHAR(100)")
    private String reason;

    @OneToMany(mappedBy = "adjustment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InventoryAdjustmentItemEntity> items;

    @ManyToOne
    @JoinColumn(name = "staff_uid", nullable = false)
    private UserEntity staff;
}
