package app.server.phone_shop.api.inventory_exports;

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

import app.server.phone_shop.api.customers.CustomerDto;
import app.server.phone_shop.api.inventory_entries.request_dto.CreateEntryBodyDto;
import app.server.phone_shop.api.inventory_entry_types.InventoryEntryTypeEnum;
import app.server.phone_shop.api.users.UserDto;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/inventory-exports")
@RequiredArgsConstructor
public class InventoryExportController {

    private final InventoryExportService service;

    @PostMapping("")
    public ResponseEntity<InventoryExportDto> create(@RequestBody CreateEntryBodyDto body) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                service.create(
                        body.getSupplierUid(),
                        body.getReason(),
                        body.getItems()));
    }

    @GetMapping("/{uid}")
    public ResponseEntity<InventoryExportDto> getByUid(@PathVariable UUID uid) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.getByUid(uid));
    }

    @GetMapping("/{uid}/staff")
    public ResponseEntity<UserDto> getStaff(@PathVariable UUID uid) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.getStaff(uid));
    }

    @GetMapping("/{uid}/customer")
    public ResponseEntity<CustomerDto> getCustomer(@PathVariable UUID uid) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.getCustomer(uid));
    }

    @GetMapping("")
    public ResponseEntity<Page<InventoryExportDto>> getAll(
            @RequestParam(required = false) InventoryEntryTypeEnum type,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "createdAt,asc") String sort) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.getAll(type, page, size, sort));
    }
}
