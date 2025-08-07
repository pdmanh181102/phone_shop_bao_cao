package app.server.phone_shop.api.inventory_entry_types;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/inventory-entry-types")
@RequiredArgsConstructor
public class InventoryEntryTypeController {

    @GetMapping("")
    public ResponseEntity<List<InventoryEntryTypeDto>> getAll() {
        List<InventoryEntryTypeDto> list = Arrays.stream(InventoryEntryTypeEnum.values())
                .map(status -> new InventoryEntryTypeDto(status.name(), status.getLabel()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

}
