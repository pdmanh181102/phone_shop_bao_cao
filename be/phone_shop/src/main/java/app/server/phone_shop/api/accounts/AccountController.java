package app.server.phone_shop.api.accounts;

import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import app.server.phone_shop.api.account_status.AccountStatusEnum;
import app.server.phone_shop.api.accounts.request_dto.CreateAccountDto;
import app.server.phone_shop.api.roles.RoleDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService service;

    @PostMapping("")
    public ResponseEntity<?> create(
            @RequestParam UUID userUid,
            @RequestBody @Valid CreateAccountDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                service.create(userUid, dto.getUsername(), dto.getPassword()));
    }

    @GetMapping("/{uid}")
    public ResponseEntity<AccountDto> getByUid(@PathVariable UUID uid) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.getByUid(uid));
    }

    @GetMapping("")
    public ResponseEntity<Page<AccountDto>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "username,asc") String sort) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.getAll(page, size, sort, search));
    }

    @PatchMapping("/{uid}/force-update/password")
    public ResponseEntity<AccountDto> fUpdatePassword(@PathVariable UUID uid,
            @RequestParam String password) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.fUpdatePassword(uid, password));
    }

    @PatchMapping("/{uid}/update/password")
    public ResponseEntity<AccountDto> updatePassword(@PathVariable UUID uid, @RequestParam String oldPassword,
            @RequestParam String password) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.updatePassword(uid, oldPassword, password));
    }

    // @PatchMapping("/{uid}/update/photo")
    // public ResponseEntity<AccountDto> updatePhotoUrl(@PathVariable UUID uid,
    // @RequestParam String url) {
    // return ResponseEntity.status(HttpStatus.OK).body(
    // service.updatePhotoUrl(uid, url));
    // }

    @PatchMapping("/{uid}/update/status")
    public ResponseEntity<AccountDto> udpateStatus(@PathVariable UUID uid, @RequestParam AccountStatusEnum statusUid) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.updateStatus(uid, statusUid));
    }

    @DeleteMapping("/{uid}")
    public ResponseEntity<AccountDto> deleteByUid(@PathVariable UUID uid) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.deleteByUid(uid));
    }

    @GetMapping("/exists")
    public ResponseEntity<Map<String, Boolean>> checkUsernameExists(@RequestParam String username) {
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("exists",
                service.checkUsernameExists(username)));
    }

    @GetMapping("/{uid}/roles")
    public ResponseEntity<Set<RoleDto>> getAccountRoles(@PathVariable UUID uid) {
        return ResponseEntity.status(HttpStatus.OK).body(service.getAllRoles(uid));
    }

    @PostMapping("/{uid}/roles")
    public ResponseEntity<?> addRole(@PathVariable UUID uid, @RequestParam UUID roleUid) {
        service.addRole(uid, roleUid);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{uid}/roles/{roleUid}")
    public ResponseEntity<?> removeRole(@PathVariable UUID uid, @PathVariable UUID roleUid) {
        service.removeRole(uid, roleUid);
        return ResponseEntity.noContent().build();
    }

}
