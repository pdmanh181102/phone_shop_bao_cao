package app.server.phone_shop.api.product_photos;

import java.util.UUID;

import app.server.phone_shop.core.audit.AuditDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class ProductPhotoDto extends AuditDto {
    private UUID uid;
    private String photoUrl;
    private Boolean isDefault;
}
