package app.server.phone_shop.api.inventory_entry_items;

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
@RequestMapping("/inventory-entries/{entryUid}/items")
@RequiredArgsConstructor
public class InventoryEntryItemController {

    private final InventoryEntryItemService service;

    @GetMapping("")
    public ResponseEntity<List<InventoryEntryItemDto>> getAll(
            @PathVariable UUID entryUid) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.getAll(entryUid));
    }
}
