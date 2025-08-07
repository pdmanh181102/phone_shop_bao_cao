package app.server.phone_shop.core.config;

import java.util.UUID;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import app.server.phone_shop.core.audit.AuditAware;
import app.server.phone_shop.core.auth.AuthService;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
@RequiredArgsConstructor
public class AuditConfig {

    private final AuthService authService;

    @Bean
    public AuditorAware<UUID> auditorProvider() {
        return new AuditAware(authService);
    }
}