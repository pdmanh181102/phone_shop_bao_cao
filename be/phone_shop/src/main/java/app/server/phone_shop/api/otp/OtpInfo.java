package app.server.phone_shop.api.otp;

import java.time.LocalDateTime;

public record OtpInfo(String otp, LocalDateTime expiresAt) {
}