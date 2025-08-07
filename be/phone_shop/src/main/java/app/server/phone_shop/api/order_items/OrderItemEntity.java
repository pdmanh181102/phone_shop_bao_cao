package app.server.phone_shop.api.order_items;

import java.math.BigDecimal;
import java.util.UUID;

import app.server.phone_shop.api.orders.OrderEntity;
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
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "order_items", uniqueConstraints = @UniqueConstraint(columnNames = { "order_uid",
        "product_uid" }))
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false, exclude = "order")
@Builder
@Getter
@Setter
public class OrderItemEntity extends AuditEntity {
    @Id
    @GeneratedValue(generator = "UUID")
    @Column
    private UUID uid;

    @Column(nullable = false)
    @Min(1)
    private int quantity;

    @ManyToOne
    @JoinColumn(name = "order_uid", nullable = false)
    private OrderEntity order;

    @ManyToOne
    @JoinColumn(name = "product_uid", nullable = false)
    private ProductEntity product;

    @Column(name = "price", nullable = false)
    private BigDecimal price;
}
