package app.server.phone_shop.api.suppliers;

import java.util.Map;
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

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService service;

    @PostMapping("")
    public ResponseEntity<SupplierDto> create(@RequestParam String name) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                service.create(name));
    }

    @GetMapping("/{uid}")
    public ResponseEntity<SupplierDto> getByUid(@PathVariable UUID uid) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.getByUid(uid));
    }

    @GetMapping("")
    public ResponseEntity<Page<SupplierDto>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "name,asc") String sort) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.getAll(page, size, sort, search));
    }

    @PatchMapping("/{uid}/update/name")
    public ResponseEntity<SupplierDto> updateName(@PathVariable UUID uid, @RequestParam String name) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.updateName(uid, name));
    }

    @PatchMapping("/{uid}/update/photo")
    public ResponseEntity<SupplierDto> updatePhotoUrl(@PathVariable UUID uid, @RequestParam String url) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.updatePhotoUrl(uid, url));
    }

    @DeleteMapping("/{uid}")
    public ResponseEntity<SupplierDto> deleteByUid(@PathVariable UUID uid) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.deleteByUid(uid));
    }

    @GetMapping("/exists")
    public ResponseEntity<Map<String, Boolean>> checkNameExists(@RequestParam String name) {
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("exists",
                service.checkNameExists(name)));
    }

}
