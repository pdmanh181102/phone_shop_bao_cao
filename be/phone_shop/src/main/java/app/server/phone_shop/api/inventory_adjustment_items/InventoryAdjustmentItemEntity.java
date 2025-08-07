package app.server.phone_shop.api.inventory_adjustment_items;

import java.util.UUID;

import app.server.phone_shop.api.inventory_adjustment.InventoryAdjustmentEntity;
import app.server.phone_shop.api.products.ProductEntity;
import app.server.phone_shop.core.audit.AuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "inventory_adjustment_items", uniqueConstraints = @UniqueConstraint(columnNames = { "adjustment_uid",
        "product_uid" }))
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
@Builder
public class InventoryAdjustmentItemEntity extends AuditEntity {
    @Id
    @GeneratedValue(generator = "UUID")
    @Column
    private UUID uid;

    @Column(nullable = false, name = "before_quantity")
    private int beforeQuantity;

    @Column(nullable = false, name = "quantity")
    private int quantity;

    @ManyToOne
    @JoinColumn(name = "adjustment_uid", nullable = false)
    private InventoryAdjustmentEntity adjustment;

    @ManyToOne
    @JoinColumn(name = "product_uid", nullable = false)
    private ProductEntity product;
}
