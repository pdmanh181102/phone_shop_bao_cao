package app.server.phone_shop.api.inventory_export_items;

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
@RequestMapping("/inventory-exports/{exportUid}/items")
@RequiredArgsConstructor
public class InventoryExportItemController {

    private final InventoryExportItemService service;

    @GetMapping("")
    public ResponseEntity<List<InventoryExportItemDto>> getAll(
            @PathVariable UUID exportUid) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.getAll(exportUid));
    }
}
