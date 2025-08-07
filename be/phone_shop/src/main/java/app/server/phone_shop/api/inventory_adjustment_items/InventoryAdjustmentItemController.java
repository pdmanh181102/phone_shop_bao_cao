package app.server.phone_shop.api.inventory_adjustment_items;

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
@RequestMapping("/inventory-adjustments/{adjustmentUid}/items")
@RequiredArgsConstructor
public class InventoryAdjustmentItemController {

    private final InventoryAdjustmentItemService service;

    @GetMapping("")
    public ResponseEntity<List<InventoryAdjustmentItemDto>> getAll(
            @PathVariable UUID adjustmentUid) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.getAll(adjustmentUid));
    }
}
