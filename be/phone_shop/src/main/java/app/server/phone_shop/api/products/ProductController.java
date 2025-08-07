package app.server.phone_shop.api.products;

import java.math.BigDecimal;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import app.server.phone_shop.api.brands.BrandDto;
import app.server.phone_shop.api.product_lines.ProductLineDto;
import app.server.phone_shop.api.product_status.ProductStatusEnum;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

        private final ProductService service;

        @PostMapping("")
        public ResponseEntity<ProductDto> create(@RequestParam UUID brandUid, @RequestParam String name) {
                return ResponseEntity.status(HttpStatus.CREATED).body(
                                service.create(brandUid, name));
        }

        @GetMapping("/{uid}")
        public ResponseEntity<ProductDto> getByUid(@PathVariable UUID uid) {
                return ResponseEntity.status(HttpStatus.OK).body(
                                service.getByUid(uid));
        }

        @GetMapping("/{uid}/brand")
        public ResponseEntity<BrandDto> getProductBrand(@PathVariable UUID uid) {
                return ResponseEntity.status(HttpStatus.OK).body(
                                service.getBrand(uid));
        }

        @GetMapping("")
        public ResponseEntity<Page<ProductDto>> getAll(
                        @RequestParam(required = false) Set<UUID> productUids,
                        @RequestParam(required = false) Set<UUID> brandUids,
                        @RequestParam(required = false) Set<ProductStatusEnum> statuses,
                        @RequestParam(required = false) Set<UUID> productLineUids,
                        @RequestParam(required = false) String search,
                        @RequestParam(required = false) Integer page,
                        @RequestParam(required = false) Integer size,
                        @RequestParam(defaultValue = "name,asc") String sort) {
                return ResponseEntity.status(HttpStatus.OK).body(
                                service.getAll(productUids, brandUids, statuses, productLineUids, page, size, sort,
                                                search));
        }

        @PatchMapping("/{uid}/update/name")
        public ResponseEntity<ProductDto> updateName(@PathVariable UUID uid, @RequestParam String name) {
                return ResponseEntity.status(HttpStatus.OK).body(
                                service.updateName(uid, name));
        }

        @PatchMapping("/{uid}/update/price")
        public ResponseEntity<ProductDto> updatePrice(@PathVariable UUID uid, @RequestParam BigDecimal price) {
                return ResponseEntity.status(HttpStatus.OK).body(
                                service.updatePrice(uid, price));
        }

        @PatchMapping("/{uid}/update/status")
        public ResponseEntity<ProductDto> updateStatus(@PathVariable UUID uid, @RequestParam ProductStatusEnum status) {
                return ResponseEntity.status(HttpStatus.OK).body(
                                service.updateStatus(uid, status));
        }

        @DeleteMapping("/{uid}")
        public ResponseEntity<ProductDto> deleteByUid(@PathVariable UUID uid) {
                return ResponseEntity.status(HttpStatus.OK).body(
                                service.deleteByUid(uid));
        }

        @GetMapping("/exists")
        public ResponseEntity<Map<String, Boolean>> checkNameExists(@RequestParam UUID brandUid,
                        @RequestParam String name) {
                return ResponseEntity.status(HttpStatus.OK).body(Map.of("exists",
                                service.checkNameExists(brandUid, name)));
        }

        // product line
        @GetMapping("/{uid}/product-lines")
        public ResponseEntity<Page<ProductLineDto>> getProductLines(@PathVariable UUID uid,
                        @RequestParam(defaultValue = "true") Boolean isConnected) {
                return ResponseEntity.status(HttpStatus.OK).body(
                                service.getProductLinesByBrandAndProduct(uid, isConnected));
        }

        @PostMapping("/{uid}/product-lines/{productLineUid}")
        public ResponseEntity<?> addProductLine(@PathVariable UUID uid, @PathVariable UUID productLineUid) {
                service.addProductLine(uid, productLineUid);
                return ResponseEntity.noContent().build();
        }

        @DeleteMapping("/{uid}/product-lines/{productLineUid}")
        public ResponseEntity<?> deleteProductLine(@PathVariable UUID uid, @PathVariable UUID productLineUid) {
                service.removeProductLine(uid, productLineUid);
                return ResponseEntity.noContent().build();
        }

}
