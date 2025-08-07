package app.server.phone_shop.api.customer_auth;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.server.phone_shop.api.auth.request_dto.LoginDto;
import app.server.phone_shop.api.customers.CustomerDto;
import app.server.phone_shop.api.customers.CustomerService;
import app.server.phone_shop.api.customers.request_dto.CreateCustomerRequest;
import app.server.phone_shop.api.mail.EmailService;
import app.server.phone_shop.api.otp.OtpService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/customer-auth")
@RequiredArgsConstructor
public class CustomerAuthController {

    private final CustomerService customerService;
    private final OtpService otpService;
    private final EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto dto) {

        try {
            Thread.sleep(1000);
        } catch (Exception e) {
        }

        CustomerDto customerDto = customerService.login(dto.getUsername(), dto.getPassword());
        return ResponseEntity.ok().body(
                Map.of("accountUid", customerDto.getUid()));
    }

    @PostMapping("/register")
    public ResponseEntity<CustomerDto> createCustomer(@RequestBody CreateCustomerRequest dto) {
        CustomerDto created = customerService.createCustomer(dto);
        String email = dto.getEmail();
        String otp = otpService.generateOtp(email);
        if (email.contains("@")) {
            emailService.sendOtpEmail(email, otp);
        } else {

        }

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
