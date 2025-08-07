package app.server.phone_shop.api.auth;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.server.phone_shop.api.accounts.AccountDto;
import app.server.phone_shop.api.accounts.AccountService;
import app.server.phone_shop.api.auth.request_dto.LoginDto;
import app.server.phone_shop.core.auth.CustomUserDetails;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AccountService accountService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto dto) {

        try {
            Thread.sleep(1000);
        } catch (Exception e) {
        }

        AccountDto accountDto = accountService.getByUsernameAndPassword(
                dto.getUsername(),
                dto.getPassword());

        return ResponseEntity.ok().body(
                Map.of("accountUid", accountDto.getUid()));
    }

    @GetMapping("/check-login")
    public ResponseEntity<?> checkLogin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Chưa đăng nhập");
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof CustomUserDetails customUser)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai kiểu principal");
        }

        UUID accountUid = customUser.getAccountUid();
        UUID userUid = customUser.getUserUid();
        List<String> authorities = customUser.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("accountUid", accountUid);
        response.put("userUid", userUid);
        response.put("authorities", authorities);

        return ResponseEntity.ok(response);
    }

}
