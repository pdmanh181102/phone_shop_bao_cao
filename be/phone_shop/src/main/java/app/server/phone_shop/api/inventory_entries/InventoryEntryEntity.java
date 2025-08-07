package app.server.phone_shop.api.inventory_entries;

import java.util.List;
import java.util.UUID;

import app.server.phone_shop.api.inventory_entry_items.InventoryEntryItemEntity;
import app.server.phone_shop.api.inventory_receipts.InventoryReceiptEntity;
import app.server.phone_shop.api.suppliers.SupplierEntity;
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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "inventory_entries")
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
@Builder
public class InventoryEntryEntity extends AuditEntity {
    @Id
    @GeneratedValue(generator = "UUID")
    @Column
    private UUID uid;

    @Column(nullable = false, columnDefinition = "NVARCHAR(100)")
    private String reason;

    @OneToMany(mappedBy = "entry", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InventoryEntryItemEntity> items;

    @ManyToOne
    @JoinColumn(name = "supplier_uid", nullable = false)
    private SupplierEntity supplier;

    @ManyToOne
    @JoinColumn(name = "staff_uid", nullable = false)
    private UserEntity staff;

    @OneToOne(mappedBy = "entry")
    private InventoryReceiptEntity receipt;
}
