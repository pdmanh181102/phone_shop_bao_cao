package app.server.phone_shop.api.inventory_adjustment;

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

import app.server.phone_shop.api.inventory_adjustment.request_dto.CreateAdjustmentBodyDto;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/inventory-adjustments")
@RequiredArgsConstructor
public class InventoryAdjustmentController {

    private final InventoryAdjustmentService service;

    @PostMapping("")
    public ResponseEntity<InventoryAdjustmentEntryDto> create(@RequestBody CreateAdjustmentBodyDto body) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                service.create(
                        body.getReason(),
                        body.getItems()));
    }

    @GetMapping("/{uid}")
    public ResponseEntity<InventoryAdjustmentEntryDto> getByUid(@PathVariable UUID uid) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.getByUid(uid));
    }

    @GetMapping("")
    public ResponseEntity<Page<InventoryAdjustmentEntryDto>> getAll(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "createdAt,asc") String sort) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.getAll(page, size, sort));
    }
}
