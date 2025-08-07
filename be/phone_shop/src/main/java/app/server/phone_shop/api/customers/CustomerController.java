package app.server.phone_shop.api.customers;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import app.server.phone_shop.api.customers.request_dto.CreateCustomerRequest;
import app.server.phone_shop.api.customers.request_dto.UpdateForgotPasswordRequest;
import app.server.phone_shop.api.customers.request_dto.UpdatePasswordResponse;
import app.server.phone_shop.api.orders.OrderDto;
import app.server.phone_shop.api.user_genders.GenderEnum;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService service;

    @PatchMapping("/update/password/email")
    public ResponseEntity<UpdatePasswordResponse> updatePasswordByEmail(
            @RequestBody @Valid UpdateForgotPasswordRequest request) {
        return ResponseEntity.ok(
                service.updatePasswordByEmail(request.getEmail(), request.getNewPassword()));
    }

    @Deprecated
    @PostMapping("")
    public ResponseEntity<CustomerDto> createCustomer(@RequestBody CreateCustomerRequest dto) {
        CustomerDto created = service.createCustomer(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{uid}")
    public ResponseEntity<CustomerDto> getByUid(@PathVariable UUID uid) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.getByUid(uid));
    }

    @GetMapping("/{uid}/orders")
    public ResponseEntity<List<OrderDto>> getOrders(@PathVariable UUID uid) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.getOrders(uid));
    }

    @GetMapping("/exists/username")
    public ResponseEntity<Map<String, Boolean>> checkUsernameExists(@RequestParam String username) {
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("exists",
                service.checkUsernameExists(username)));
    }

    @GetMapping("/exists/email")
    public ResponseEntity<Map<String, Boolean>> checkEmailExists(@RequestParam String email) {
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("exists",
                service.checkEmailExists(email)));
    }

    @PatchMapping("/{uid}/update/photo")
    public ResponseEntity<CustomerDto> updatePhotoUrl(@PathVariable UUID uid, @RequestParam String url) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.updatePhotoUrl(uid, url));
    }

    @PatchMapping("/{uid}/update/first-name")
    public ResponseEntity<CustomerDto> updateFirstName(@PathVariable UUID uid, @RequestParam String firstName) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.updateFirstName(uid, firstName));
    }

    @PatchMapping("/{uid}/update/last-name")
    public ResponseEntity<CustomerDto> updateLastName(@PathVariable UUID uid, @RequestParam String lastName) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.updateLastName(uid, lastName));
    }

    @PatchMapping("/{uid}/update/gender")
    public ResponseEntity<CustomerDto> updateGender(@PathVariable UUID uid, @RequestParam GenderEnum gender) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.updateGender(uid, gender));
    }

    @PatchMapping("/{uid}/update/address")
    public ResponseEntity<CustomerDto> updateAddress(@PathVariable UUID uid, @RequestParam String address) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.updateAddress(uid, address));
    }

    @PatchMapping("/{uid}/update/phone-number")
    public ResponseEntity<CustomerDto> updatePhoneNumber(@PathVariable UUID uid, @RequestParam String phoneNumber) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.updatePhoneNumber(uid, phoneNumber));
    }

    @PatchMapping("/{uid}/update/password")
    public ResponseEntity<CustomerDto> updatePassword(@PathVariable UUID uid, @RequestParam String oldPassword,
            @RequestParam String password) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.updatePassword(uid, oldPassword, password));
    }

}
