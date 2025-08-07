package app.server.phone_shop.api.product_attributes;

import java.util.List;
import java.util.UUID;

import app.server.phone_shop.api.product_attribute_items.ProductAttributeItemEntity;
import app.server.phone_shop.api.products.ProductEntity;
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
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product_attributes", uniqueConstraints = @UniqueConstraint(columnNames = { "name", "product_uid" }))
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
@Builder
public class ProductAttributeEntity extends AuditEntity {
    @Id
    @GeneratedValue(generator = "UUID")
    @Column
    private UUID uid;

    @Column(nullable = false, columnDefinition = "NVARCHAR(100)")
    private String name;

    @Column(nullable = true, name = "group_name", columnDefinition = "NVARCHAR(100)")
    private String groupName;

    @ManyToOne
    @JoinColumn(name = "product_uid", nullable = false)
    private ProductEntity product;

    @OneToMany(mappedBy = "attribute", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductAttributeItemEntity> items;
}
