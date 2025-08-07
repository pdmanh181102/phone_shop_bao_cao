package app.server.phone_shop.api.users;

import java.util.UUID;

import app.server.phone_shop.api.user_genders.GenderEnum;
import app.server.phone_shop.core.audit.AuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "staffs", uniqueConstraints = @UniqueConstraint(columnNames = "name"))
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
@Builder
public class UserEntity extends AuditEntity {
    @Id
    @GeneratedValue(generator = "UUID")
    @Column
    private UUID uid;

    @Column(nullable = false, name = "first_name", columnDefinition = "NVARCHAR(50)")
    private String firstName;

    @Column(nullable = false, name = "last_name", columnDefinition = "NVARCHAR(50)")
    private String lastName;

    @Column(nullable = true, name = "photo_url", columnDefinition = "NVARCHAR(200)")
    private String photoUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GenderEnum gender;
}
