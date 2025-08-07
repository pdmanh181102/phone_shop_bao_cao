package app.server.phone_shop.api.role_privileges;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface RolePrivilegeRepository
        extends JpaRepository<RolePrivilegeEntity, UUID>, JpaSpecificationExecutor<RolePrivilegeEntity> {
}
