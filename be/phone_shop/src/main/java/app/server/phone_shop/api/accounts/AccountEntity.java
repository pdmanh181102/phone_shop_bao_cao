package app.server.phone_shop.api.accounts;

import java.util.Set;
import java.util.UUID;

import app.server.phone_shop.api.account_status.AccountStatusEnum;
import app.server.phone_shop.api.roles.RoleEntity;
import app.server.phone_shop.api.users.UserEntity;
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
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "accounts", uniqueConstraints = @UniqueConstraint(columnNames = "username"))
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
@Builder
public class AccountEntity extends AuditEntity {
    @Id
    @GeneratedValue(generator = "UUID")
    @Column
    private UUID uid;

    @Column(nullable = false, columnDefinition = "NVARCHAR(50)")
    private String username;

    @Column(nullable = false, columnDefinition = "NVARCHAR(255)")
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountStatusEnum status;

    @ManyToOne
    @JoinColumn(name = "user_uid", nullable = true)
    private UserEntity user;

    @ManyToMany
    @JoinTable(name = "account_roles", joinColumns = @JoinColumn(name = "account_uid"), inverseJoinColumns = @JoinColumn(name = "role_uid"))
    private Set<RoleEntity> roles;
}
