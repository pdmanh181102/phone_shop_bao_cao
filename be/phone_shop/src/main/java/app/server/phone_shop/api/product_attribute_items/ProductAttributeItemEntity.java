package app.server.phone_shop.api.product_attribute_items;

import java.util.UUID;

import app.server.phone_shop.api.product_attributes.ProductAttributeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "attribute_items", uniqueConstraints = @UniqueConstraint(columnNames = { "value", "attribute_uid" }))
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductAttributeItemEntity {
    @Id
    @GeneratedValue(generator = "UUID")
    @Column
    private UUID uid;

    @Column(nullable = false, columnDefinition = "NVARCHAR(100)")
    private String value;

    @ManyToOne
    @JoinColumn(name = "attribute_uid", nullable = false)
    private ProductAttributeEntity attribute;
}
