package app.server.phone_shop.core.auth;

import java.util.Collection;
import java.util.UUID;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.ToString;

@ToString
public class CustomUserDetails implements UserDetails {

    private String type;
    private UUID userUid;
    private UUID accountUid;
    private Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(String type, UUID accountUid, UUID userUid,
            Collection<? extends GrantedAuthority> authorities) {
        this.type = type;
        this.userUid = userUid;
        this.accountUid = accountUid;
        this.authorities = authorities;
    }

    public String getType() {
        return type;
    }

    public UUID getUserUid() {
        return userUid;
    }

    public UUID getAccountUid() {
        return accountUid;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return null; // Không dùng password
    }

    @Override
    public String getUsername() {
        return accountUid.toString(); // hoặc email, tùy bạn
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
