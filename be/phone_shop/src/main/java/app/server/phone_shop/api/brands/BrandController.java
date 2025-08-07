package app.server.phone_shop.api.brands;

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
@RequestMapping("/brands")
@RequiredArgsConstructor
public class BrandController {

    private final BrandService service;

    @PostMapping("")
    public ResponseEntity<BrandDto> create(@RequestParam String name) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                service.create(name));
    }

    @GetMapping("/{uid}")
    public ResponseEntity<BrandDto> getByUid(@PathVariable UUID uid) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.getByUid(uid));
    }

    @GetMapping("")
    public ResponseEntity<Page<BrandDto>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "name,asc") String sort) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.getAll(page, size, sort, search));
    }

    @PatchMapping("/{uid}/update/name")
    public ResponseEntity<BrandDto> updateName(@PathVariable UUID uid, @RequestParam String name) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.updateName(uid, name));
    }

    @PatchMapping("/{uid}/update/photo")
    public ResponseEntity<BrandDto> updatePhotoUrl(@PathVariable UUID uid, @RequestParam String url) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.updatePhotoUrl(uid, url));
    }

    @DeleteMapping("/{uid}")
    public ResponseEntity<BrandDto> deleteByUid(@PathVariable UUID uid) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.deleteByUid(uid));
    }

    @GetMapping("/exists")
    public ResponseEntity<Map<String, Boolean>> checkNameExists(@RequestParam String name) {
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("exists",
                service.checkNameExists(name)));
    }

}
