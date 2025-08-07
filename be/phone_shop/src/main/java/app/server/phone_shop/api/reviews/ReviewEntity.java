// package app.server.phone_shop.api.reviews;

// import java.time.LocalDate;
// import java.util.UUID;

// import app.server.phone_shop.api.products.ProductEntity;
// import app.server.phone_shop.api.users.UserEntity;
// import app.server.phone_shop.core.audit.AuditEntity;
// import jakarta.persistence.Column;
// import jakarta.persistence.Entity;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.Id;
// import jakarta.persistence.JoinColumn;
// import jakarta.persistence.ManyToOne;
// import jakarta.persistence.Table;
// import jakarta.persistence.UniqueConstraint;
// import jakarta.validation.constraints.Max;
// import jakarta.validation.constraints.Min;
// import jakarta.validation.constraints.Size;
// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.EqualsAndHashCode;
// import lombok.Getter;
// import lombok.NoArgsConstructor;
// import lombok.Setter;

// @Entity
// @Table(name = "reviews", uniqueConstraints = @UniqueConstraint(columnNames = { "user_uid", "product_uid" }))
// @Getter
// @Setter
// @NoArgsConstructor
// @AllArgsConstructor
// @Builder
// @EqualsAndHashCode(callSuper = false)
// public class ReviewEntity extends AuditEntity {

//     @Id
//     @GeneratedValue(generator = "UUID")
//     @Column
//     private UUID uid;

//     @Min(1)
//     @Max(5)
//     @Column(nullable = false)
//     private int star; // Số sao đánh giá: 1-5

//     @Size(max = 500)
//     @Column(name = "review_content", nullable = false, length = 500)
//     private String content; // Nội dung đánh giá (giới hạn 500 ký tự)

//     @Column(nullable = false)
//     private LocalDate date; // Ngày đánh giá

//     @ManyToOne(optional = false)
//     @JoinColumn(name = "user_uid", nullable = false)
//     private UserEntity user;

//     @ManyToOne(optional = false)
//     @JoinColumn(name = "product_uid", nullable = false)
//     private ProductEntity product;
// }

package app.server.phone_shop.api.reviews;

import java.time.LocalDate;
import java.util.UUID;

import app.server.phone_shop.api.order_items.OrderItemEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = false)
public class ReviewEntity {

    @Id
    @GeneratedValue(generator = "UUID")
    @Column
    private UUID uid;

    @Min(1)
    @Max(5)
    @Column(nullable = false)
    private int star; // Số sao đánh giá: 1-5

    @Column(name = "review_content", columnDefinition = "NVARCHAR(500)")
    private String reviewContent; // Nội dung đánh giá (giới hạn 500 ký tự)

    @Column(nullable = false)
    private LocalDate date; // Ngày đánh giá

    @ManyToOne(optional = false)
    @JoinColumn(name = "order_item_uid", nullable = false)
    private OrderItemEntity orderItem;
}
