package app.server.phone_shop.api.role_privileges;

import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class RolePrivilegeSpecification {

    public static Specification<RolePrivilegeEntity> hasRoleUid(UUID roleUid) {
        return new Specification<RolePrivilegeEntity>() {
            @Override
            public Predicate toPredicate(Root<RolePrivilegeEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                if (roleUid == null)
                    return null;
                return cb.equal(root.get("role").get("uid"), roleUid);
            }
        };
    }
}
