package app.server.phone_shop.api.accounts;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<AccountEntity, UUID>, JpaSpecificationExecutor<AccountEntity> {
    Optional<AccountEntity> findByUsername(String username);

    @Query("SELECT p FROM AccountEntity p WHERE p.user.uid = :userUid")
    Optional<AccountEntity> findByUserUid(@Param("userUid") UUID userUid);

    @Query("""
                SELECT DISTINCT a FROM AccountEntity a
                LEFT JOIN FETCH a.roles r
                LEFT JOIN FETCH r.privileges p
                WHERE a.uid = :accountUid
            """)
    Optional<AccountEntity> findWithPrivilegesByUid(@Param("accountUid") UUID accountUid);

}
