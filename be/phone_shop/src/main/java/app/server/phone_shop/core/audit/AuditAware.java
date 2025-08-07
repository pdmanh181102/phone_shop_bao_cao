package app.server.phone_shop.core.audit;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.AuditorAware;

import app.server.phone_shop.core.auth.AuthService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class AuditAware implements AuditorAware<UUID> {

    private final AuthService authService;

    @Override
    public Optional<UUID> getCurrentAuditor() {
        return Optional.of(UUID.randomUUID());
    }

}