package app.server.phone_shop.api.product_attribute_items;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/attributes-items")
@RequiredArgsConstructor
public class ProductAttributeItemController {
    private final ProductAttributeItemService service;

    @GetMapping("")
    public ResponseEntity<List<ProductAttributeItemDto>> getAllByAttributeUid(
            @RequestParam UUID attributeUid) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.getAllByAttributeUid(attributeUid));
    }
}
