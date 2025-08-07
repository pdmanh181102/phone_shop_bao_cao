package app.server.phone_shop.api.users;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import app.server.phone_shop.api.accounts.AccountDto;
import app.server.phone_shop.api.accounts.AccountService;
import app.server.phone_shop.api.user_genders.GenderEnum;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;
    private final AccountService accountService;

    @PostMapping("")
    public ResponseEntity<UserDto> create(
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam GenderEnum gender) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                service.create(firstName, lastName, gender));
    }

    @GetMapping("/{uid}")
    public ResponseEntity<UserDto> getByUid(@PathVariable UUID uid) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.getByUid(uid));
    }

    @GetMapping("/{userUid}/accounts")
    public ResponseEntity<AccountDto> getAccounts(@PathVariable UUID userUid) {
        return ResponseEntity.status(HttpStatus.OK).body(
                accountService.getByUserUid(userUid));
    }

    @GetMapping("")
    public ResponseEntity<Page<UserDto>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "firstName,asc") String sort) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.getAll(page, size, sort, search));
    }

    @PatchMapping("/{uid}/update/photo")
    public ResponseEntity<UserDto> updatePhotoUrl(@PathVariable UUID uid, @RequestParam String url) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.updatePhotoUrl(uid, url));
    }

    @PatchMapping("/{uid}/update/first-name")
    public ResponseEntity<UserDto> updateFirstName(@PathVariable UUID uid, @RequestParam String firstName) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.updateFirstName(uid, firstName));
    }

    @PatchMapping("/{uid}/update/last-name")
    public ResponseEntity<UserDto> updateLastName(@PathVariable UUID uid, @RequestParam String lastName) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.updateLastName(uid, lastName));
    }

    @PatchMapping("/{uid}/update/gender")
    public ResponseEntity<UserDto> updateGender(@PathVariable UUID uid, @RequestParam GenderEnum gender) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.updateGender(uid, gender));
    }

    @DeleteMapping("/{uid}")
    public ResponseEntity<UserDto> deleteByUid(@PathVariable UUID uid) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.deleteByUid(uid));
    }
}
