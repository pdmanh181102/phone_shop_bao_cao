package app.server.phone_shop.api.cart;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.server.phone_shop.api.products.ProductDto;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/{uid}/items")
    public ResponseEntity<List<ProductDto>> getAllCartItems(@PathVariable UUID uid) {
        List<ProductDto> items = cartService.getAllCartItems(uid);
        return ResponseEntity.ok(items);
    }

    @PostMapping("/{uid}/items/{productUid}")
    public ResponseEntity<Void> addProductToCart(@PathVariable UUID uid, @PathVariable UUID productUid) {
        cartService.addProductToCard(uid, productUid);
        return ResponseEntity.ok().build(); // hoặc 204 No Content
    }

    @DeleteMapping("/{uid}/items/{productUid}")
    public ResponseEntity<Void> removeProductFromCart(@PathVariable UUID uid, @PathVariable UUID productUid) {
        cartService.removeProductToCard(uid, productUid);
        return ResponseEntity.noContent().build();
    }
}
