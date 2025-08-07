package app.server.phone_shop.api.order_items;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/orders/{orderUid}/items")
@RequiredArgsConstructor
public class OrderItemController {

    private final OrderItemService service;

    @GetMapping("")
    public ResponseEntity<List<OrderItemDto>> getAll(
            @PathVariable UUID orderUid) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.getAll(orderUid));
    }
}
