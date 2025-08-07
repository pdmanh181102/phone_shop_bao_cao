package app.server.phone_shop.api.products;

import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;

import org.hibernate.annotations.ColumnDefault;

import app.server.phone_shop.api.product_lines.ProductLineEntity;
import app.server.phone_shop.api.product_status.ProductStatusEnum;
import app.server.phone_shop.core.audit.AuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products", uniqueConstraints = @UniqueConstraint(columnNames = "name"))
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
@Builder
public class ProductEntity extends AuditEntity {
    @Id
    @GeneratedValue(generator = "UUID")
    @Column
    private UUID uid;

    @Column(nullable = false, columnDefinition = "NVARCHAR(100)")
    private String name;

    @Column(nullable = false, name = "entered_quantity")
    @ColumnDefault("0")
    @Builder.Default
    private Integer enteredQuantity = 0;

    @Column(nullable = false, name = "sold_quantity")
    @ColumnDefault("0")
    @Builder.Default
    private Integer soldQuantity = 0;

    @Column(nullable = false, name = "current_quantity")
    @ColumnDefault("0")
    @Builder.Default
    private Integer currentQuantity = 0;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "star")
    private Float star;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "status")
    private ProductStatusEnum status;

    @ManyToMany
    @JoinTable(name = "product_line_products", joinColumns = @JoinColumn(name = "product_uid"), inverseJoinColumns = @JoinColumn(name = "product_line_uid"))
    private Set<ProductLineEntity> productLines;
}
