package app.server.phone_shop.api.role_privileges;

import java.util.UUID;

import app.server.phone_shop.api.permissions.PermissionEnum;
import app.server.phone_shop.api.resources.ResourceEnum;
import app.server.phone_shop.api.roles.RoleEntity;
import app.server.phone_shop.core.audit.AuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "role_privileges", uniqueConstraints = @UniqueConstraint(columnNames = { "role_uid", "permission",
        "resource" }))
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
@Builder
public class RolePrivilegeEntity extends AuditEntity {
    @Id
    @GeneratedValue(generator = "UUID")
    @Column
    private UUID uid;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "permission")
    private PermissionEnum permission;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "resource")
    private ResourceEnum resource;

    @ManyToOne
    @JoinColumn(name = "role_uid", nullable = false)
    private RoleEntity role;
}
