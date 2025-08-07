package app.server.phone_shop.api.otp;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.server.phone_shop.api.customers.CustomerService;
import app.server.phone_shop.api.mail.EmailService;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/otp")
@RequiredArgsConstructor
public class OtpController {
    private final OtpService otpService;
    private final EmailService emailService;
    private final CustomerService accountService;

    @PostMapping("/send") //// resend OTP
    public String sendOtp(@RequestBody SendOtpRequest request) {
        String otp = otpService.generateOtp(request.getKey());
        if (request.getKey().contains("@")) {
            emailService.sendOtpEmail(request.getKey(), otp);
        }
        return "OTP sent: ******";
    }

    @PostMapping("/verify")
    public ResponseEntity<VerifyOtpResponse> verifyOtp(@RequestBody VerifyOtpRequest request) {
        boolean valid = otpService.verifyOtp(request.getKey(), request.getOtp());

        if (valid) {
            accountService.verifyByEmail(request.getKey()); // Giả sử key là email
            VerifyOtpResponse response = new VerifyOtpResponse(true, "OTP verified successfully.");
            return ResponseEntity.ok(response); // HTTP 200
        } else {
            VerifyOtpResponse response = new VerifyOtpResponse(false, "OTP invalid or expired.");
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED) // HTTP 401
                    .body(response);
        }
    }

    @Data
    static class SendOtpRequest {
        private String key; // có thể là userId, email hoặc phone
    }

    @Data
    static class VerifyOtpRequest {
        private String key;
        private String otp;
    }
}
