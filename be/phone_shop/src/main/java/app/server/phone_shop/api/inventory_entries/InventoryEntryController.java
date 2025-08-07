package app.server.phone_shop.api.inventory_entries;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import app.server.phone_shop.api.inventory_entries.request_dto.CreateEntryBodyDto;
import app.server.phone_shop.api.inventory_receipts.InventoryReceiptDto;
import app.server.phone_shop.api.inventory_receipts.InventoryReceiptService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/inventory-entries")
@RequiredArgsConstructor
public class InventoryEntryController {

    private final InventoryEntryService service;
    private final InventoryReceiptService receiptService;

    @PostMapping("")
    public ResponseEntity<InventoryEntryDto> create(@RequestBody CreateEntryBodyDto body) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                service.create(
                        body.getSupplierUid(),
                        body.getReason(),
                        body.getItems()));
    }

    @GetMapping("/{uid}")
    public ResponseEntity<InventoryEntryDto> getByUid(@PathVariable UUID uid) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.getByUid(uid));
    }

    @GetMapping("/{uid}/receipt")
    public ResponseEntity<InventoryReceiptDto> getReceipt(@PathVariable UUID uid) {
        return ResponseEntity.status(HttpStatus.OK).body(
                receiptService.getByEntryUid(uid));
    }

    @GetMapping("")
    public ResponseEntity<Page<InventoryEntryDto>> getAll(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "createdAt,asc") String sort) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.getAll(page, size, sort));
    }
}
