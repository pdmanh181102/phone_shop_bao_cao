// package app.server.phone_shop.api.inventory_receipt_items;

// import java.util.UUID;

// import
// app.server.phone_shop.api.inventory_entry_items.InventoryEntryItemEntity;
// import app.server.phone_shop.api.inventory_receipts.InventoryReceiptEntity;
// import app.server.phone_shop.core.audit.AuditEntity;
// import jakarta.persistence.Column;
// import jakarta.persistence.Entity;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.Id;
// import jakarta.persistence.JoinColumn;
// import jakarta.persistence.ManyToOne;
// import jakarta.persistence.OneToOne;
// import jakarta.persistence.Table;
// import jakarta.persistence.UniqueConstraint;
// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Data;
// import lombok.EqualsAndHashCode;
// import lombok.NoArgsConstructor;

// @Entity
// @Table(name = "inventory_receipt_items", uniqueConstraints =
// @UniqueConstraint(columnNames = { "entry_item_uid" }))
// @AllArgsConstructor
// @NoArgsConstructor
// @Data
// @EqualsAndHashCode(callSuper = false)
// @Builder
// public class InventoryReceiptItemEntity extends AuditEntity {
// @Id
// @GeneratedValue(generator = "UUID")
// @Column
// private UUID uid;

// @Column(nullable = false, name = "quantity")
// private int quantity;

// @ManyToOne
// @JoinColumn(name = "receipt_uid", nullable = false)
// private InventoryReceiptEntity receipt;

// @OneToOne
// @JoinColumn(name = "entry_item_uid", nullable = false)
// private InventoryEntryItemEntity entryItem;
// }
