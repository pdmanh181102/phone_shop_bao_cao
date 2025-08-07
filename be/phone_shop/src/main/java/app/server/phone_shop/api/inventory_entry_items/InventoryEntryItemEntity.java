package app.server.phone_shop.api.inventory_entry_items;

import java.math.BigDecimal;
import java.util.UUID;

import app.server.phone_shop.api.inventory_entries.InventoryEntryEntity;
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
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "inventory_entry_items", uniqueConstraints = @UniqueConstraint(columnNames = { "entry_uid",
        "product_uid" }))
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
@Builder
public class InventoryEntryItemEntity extends AuditEntity {
    @Id
    @GeneratedValue(generator = "UUID")
    @Column
    private UUID uid;

    @Column(nullable = false)
    @Min(1)
    private int quantity;

    @Column(nullable = true, name = "real_quantity")
    @Min(0)
    private Integer realQuantity;

    @Column(nullable = false, name = "unit_price")
    @Min(0)
    private BigDecimal unitPrice;

    @ManyToOne
    @JoinColumn(name = "entry_uid", nullable = false)
    private InventoryEntryEntity entry;

    @ManyToOne
    @JoinColumn(name = "product_uid", nullable = false)
    private ProductEntity product;
}
