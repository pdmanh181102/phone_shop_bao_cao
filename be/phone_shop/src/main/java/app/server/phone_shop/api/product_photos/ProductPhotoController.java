package app.server.phone_shop.api.product_photos;

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
@RequestMapping("/product-photos")
@RequiredArgsConstructor
public class ProductPhotoController {

    private final ProductPhotoService service;

    @GetMapping("/product-avatar")
    public ResponseEntity<ProductPhotoDto> getProductAvatar(
            @RequestParam UUID productUid) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.getProductAvatar(productUid));
    }

    @PostMapping("")
    public ResponseEntity<ProductPhotoDto> create(@RequestParam UUID productUid, @RequestParam String photoUrl) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                service.create(productUid, photoUrl));
    }

    @GetMapping("")
    public ResponseEntity<Page<ProductPhotoDto>> getAll(
            @RequestParam(required = false) UUID productUid,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "uid,asc") String sort) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.getAll(productUid, page, size, sort, search));
    }

    @PatchMapping("/{uid}/update/set-default")
    public ResponseEntity<ProductPhotoDto> setDefault(@PathVariable UUID uid) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.setDefault(uid));
    }

    @DeleteMapping("/{uid}")
    public ResponseEntity<ProductPhotoDto> deleteByUid(@PathVariable UUID uid) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.deleteByUid(uid));
    }

}
