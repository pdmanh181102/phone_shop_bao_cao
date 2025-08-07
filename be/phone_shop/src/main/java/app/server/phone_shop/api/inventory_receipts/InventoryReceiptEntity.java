package app.server.phone_shop.api.inventory_receipts;

import java.util.UUID;

import app.server.phone_shop.api.inventory_entries.InventoryEntryEntity;
import app.server.phone_shop.api.users.UserEntity;
import app.server.phone_shop.core.audit.AuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "inventory_receipts")
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
@Builder
public class InventoryReceiptEntity extends AuditEntity {
    @Id
    @GeneratedValue(generator = "UUID")
    @Column
    private UUID uid;

    @Column(columnDefinition = "NVARCHAR(200)")
    private String note;

    // @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL, orphanRemoval =
    // true)
    // private List<InventoryReceiptItemEntity> items;

    @ManyToOne
    @JoinColumn(name = "staff_uid", nullable = false)
    private UserEntity staff;

    @OneToOne
    @JoinColumn(name = "entry_uid", nullable = false)
    private InventoryEntryEntity entry;
}
