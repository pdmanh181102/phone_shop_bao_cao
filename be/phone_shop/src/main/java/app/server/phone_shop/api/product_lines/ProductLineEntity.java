package app.server.phone_shop.api.product_lines;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import app.server.phone_shop.api.brands.BrandEntity;
import app.server.phone_shop.api.products.ProductEntity;
import app.server.phone_shop.core.audit.AuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product_lines", uniqueConstraints = @UniqueConstraint(columnNames = { "name", "brand_uid" }))
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
@Builder
public class ProductLineEntity extends AuditEntity {
    @Id
    @GeneratedValue(generator = "UUID")
    @Column
    @EqualsAndHashCode.Include
    private UUID uid;

    @Column(nullable = false, columnDefinition = "NVARCHAR(50)")
    private String name;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isDefault = false;

    @ManyToOne
    @JoinColumn(name = "brand_uid", nullable = false)
    private BrandEntity brand;

    @Builder.Default
    @ManyToMany(mappedBy = "productLines")
    private Set<ProductEntity> products = new HashSet<>();

}
