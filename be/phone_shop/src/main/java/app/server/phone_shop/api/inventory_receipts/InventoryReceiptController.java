package app.server.phone_shop.api.inventory_receipts;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.server.phone_shop.api.inventory_receipts.request_dto.CreateReceiptBodyDto;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/inventory-receipts")
@RequiredArgsConstructor
public class InventoryReceiptController {
    private final InventoryReceiptService service;
    // private final InventoryReceiptItemService itemService;

    @PostMapping("")
    public ResponseEntity<?> create(@RequestBody CreateReceiptBodyDto dto) {
        return ResponseEntity.ok().body(service.create(dto.getEntryUid(), dto.getNote(), dto.getItems()));
    }

    @GetMapping("/{uid}")
    public ResponseEntity<?> getByUid(@PathVariable UUID uid) {
        return ResponseEntity.ok().body(service.getByUid(uid));
    }

    // @GetMapping("/{uid}/items")
    // public ResponseEntity<?> getItemsByUid(@PathVariable UUID uid) {
    // return ResponseEntity.ok().body(itemService.getItemsByReceiptUid(uid));
    // }
}
