package app.server.phone_shop.api.orders;

import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;

import org.hibernate.annotations.ColumnDefault;

import app.server.phone_shop.api.customers.CustomerEntity;
import app.server.phone_shop.api.order_items.OrderItemEntity;
import app.server.phone_shop.api.order_status.OrderStatusEnum;
import app.server.phone_shop.api.payment_methods.PaymentMethodEnum;
import app.server.phone_shop.api.users.UserEntity;
import app.server.phone_shop.core.audit.AuditEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "orders")
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false, exclude = "items")
@Builder
@Getter
@Setter
public class OrderEntity extends AuditEntity {
    @Id
    @GeneratedValue(generator = "UUID")
    @Column
    private UUID uid;

    @Column(columnDefinition = "NVARCHAR(200)")
    private String note;

    @Column(nullable = false, columnDefinition = "NVARCHAR(200)")
    private String address;

    @Column(name = "recipient_name", nullable = false, columnDefinition = "NVARCHAR(50)")
    private String recipientName;

    @Column(name = "recipient_phone   ", nullable = false, columnDefinition = "NVARCHAR(20)")
    private String recipientPhone;

    @Column(name = "paid", nullable = false)
    @Builder.Default
    private Boolean paid = false;

    @Column(name = "apptransid", nullable = true)
    private String apptransid;

    @Column(name = "zptransid", nullable = true)
    private String zptransid;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "payment_method")
    private PaymentMethodEnum paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "status")
    private OrderStatusEnum status;

    @ManyToOne
    @JoinColumn(name = "staff_uid", nullable = true)
    private UserEntity staff;

    @ManyToOne
    @JoinColumn(name = "customer_uid", nullable = true)
    private CustomerEntity customer;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "shipping_amount", nullable = false)
    @ColumnDefault("0")
    private BigDecimal shippingAmount;

    @Column(name = "payment_amount", nullable = true)
    private BigDecimal paymentAmount;

    @Column(name = "payment_discount_amount", nullable = true)
    private BigDecimal paymentDiscountAmount;

    @Column(name = "payment_refund_id", nullable = true)
    private String paymentRefundId;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OrderItemEntity> items;

}
