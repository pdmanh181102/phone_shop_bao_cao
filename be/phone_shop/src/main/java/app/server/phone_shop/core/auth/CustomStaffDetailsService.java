package app.server.phone_shop.core.auth;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import app.server.phone_shop.api.accounts.AccountEntity;
import app.server.phone_shop.api.accounts.AccountRepository;
import app.server.phone_shop.api.permissions.PermissionEnum;
import app.server.phone_shop.api.resources.ResourceEnum;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomStaffDetailsService implements UserDetailsService {

        private final AccountRepository accountRepository;

        @Override
        public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                UUID uid = UUID.fromString(username);
                AccountEntity account = accountRepository.findWithPrivilegesByUid(uid)
                                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy tài khoản"));

                UUID accountUid = account.getUid();
                UUID userUid = null;

                if (account.getUser() != null) {
                        userUid = account.getUser().getUid();
                }

                List<GrantedAuthority> authorities = account.getRoles().stream()
                                .flatMap(role -> role.getPrivileges().stream()
                                                .map(privilege -> {
                                                        PermissionEnum permission = privilege.getPermission();
                                                        ResourceEnum resource = privilege.getResource();
                                                        return new SimpleGrantedAuthority(
                                                                        String.format("%s_%s", permission.name(),
                                                                                        resource.name()));
                                                }))
                                .collect(Collectors.toList());

                return new CustomUserDetails(AuthType.STAFF, accountUid, userUid, authorities);
        }

}
