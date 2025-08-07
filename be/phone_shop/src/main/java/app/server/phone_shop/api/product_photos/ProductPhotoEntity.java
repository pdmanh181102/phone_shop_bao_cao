package app.server.phone_shop.api.product_photos;

import java.util.UUID;

import app.server.phone_shop.api.products.ProductEntity;
import app.server.phone_shop.core.audit.AuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product_photos")
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
@Builder
public class ProductPhotoEntity extends AuditEntity {
    @Id
    @GeneratedValue(generator = "UUID")
    @Column
    private UUID uid;

    @Column(nullable = false, name = "photo_url", columnDefinition = "NVARCHAR(255)")
    private String photoUrl;

    @Column(nullable = false, name = "is_default")
    @Builder.Default
    private Boolean isDefault = false;

    @ManyToOne
    @JoinColumn(name = "product_uid", nullable = false)
    private ProductEntity product;
}
