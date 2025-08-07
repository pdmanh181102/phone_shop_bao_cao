package app.server.phone_shop.api.product_attributes;

import java.util.List;
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

import app.server.phone_shop.api.product_attributes.dto.AttributeGroupDTO;
import app.server.phone_shop.api.product_attributes.dto.AttributeNameByGroupDTO;
import app.server.phone_shop.api.product_attributes.dto.CompareProductDTO;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/product-attributes")
@RequiredArgsConstructor
public class ProductAttributeController {

        private final ProductAttributeService service;

        @PostMapping("")
        public ResponseEntity<ProductAttributeDto> create(
                        @RequestParam UUID productUid,
                        @RequestParam String name,
                        @RequestParam List<String> items,
                        @RequestParam(required = false) String groupName) {
                return ResponseEntity.status(HttpStatus.CREATED).body(
                                service.create(productUid, name, items, groupName));
        }

        @GetMapping("/{uid}")
        public ResponseEntity<ProductAttributeDto> getByUid(@PathVariable UUID uid) {
                return ResponseEntity.status(HttpStatus.OK).body(
                                service.getByUid(uid));
        }

        @GetMapping("/{productUid}/group-names")
        public ResponseEntity<List<String>> getAttributeGroupNames(@PathVariable UUID productUid) {
                return ResponseEntity.status(HttpStatus.OK).body(
                                service.getGroupNames(productUid));
        }

        @GetMapping("")
        public ResponseEntity<Page<ProductAttributeDto>> getAll(
                        @RequestParam(required = false) UUID productUid,
                        @RequestParam(required = false) String search,
                        @RequestParam(required = false) Integer page,
                        @RequestParam(required = false) Integer size,
                        @RequestParam(defaultValue = "name,asc") String sort) {
                return ResponseEntity.status(HttpStatus.OK).body(
                                service.getAll(productUid, page, size, sort, search));
        }

        @PatchMapping("/{uid}/update/name")
        public ResponseEntity<ProductAttributeDto> updateName(@PathVariable UUID uid, @RequestParam String name) {
                return ResponseEntity.status(HttpStatus.OK).body(
                                service.updateName(uid, name));
        }

        @PatchMapping("/{uid}/update/group")
        public ResponseEntity<ProductAttributeDto> updateGroup(@PathVariable UUID uid, @RequestParam String group) {
                return ResponseEntity.status(HttpStatus.OK).body(
                                service.updateGroup(uid, group));
        }

        @DeleteMapping("/{uid}")
        public ResponseEntity<ProductAttributeDto> deleteByUid(@PathVariable UUID uid) {
                return ResponseEntity.status(HttpStatus.OK).body(
                                service.deleteByUid(uid));
        }

        @GetMapping("/exists")
        public ResponseEntity<Map<String, Boolean>> checkNameExists(@RequestParam UUID productUid,
                        @RequestParam String name) {
                return ResponseEntity.status(HttpStatus.OK).body(Map.of("exists",
                                service.checkNameExists(productUid, name)));
        }

        // ===========================================mới

        @GetMapping("/attribute-groups")
        public ResponseEntity<List<AttributeNameByGroupDTO>> getAttributesByProducts(
                        @RequestParam List<UUID> productUids) {
                List<AttributeNameByGroupDTO> attributes = service.getAttributesByProducts(productUids);
                return ResponseEntity.ok(attributes);
        }

        @GetMapping("/attribute-groups-for-compare-products")
        public ResponseEntity<List<AttributeGroupDTO>> getAttributesByProductsForCompareProduct(
                        @RequestParam List<UUID> productUids) {
                List<AttributeGroupDTO> attributes = service.getAttributesByProductsForCompareProduct(productUids);
                return ResponseEntity.ok(attributes);
        }

        @GetMapping("/compare-products")
        public ResponseEntity<List<CompareProductDTO>> compareProducts(@RequestParam List<UUID> productUids) {
                List<CompareProductDTO> result = service.compareProducts(productUids);
                return ResponseEntity.ok(result);
        }

}
