package app.server.phone_shop.api.permissions;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/permissions")
@RequiredArgsConstructor
public class PermissionController {

    @GetMapping("")
    public ResponseEntity<List<PermissionDto>> getAll() {
        List<PermissionDto> list = Arrays.stream(PermissionEnum.values())
                .map(status -> new PermissionDto(status.name(), status.getLabel()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

}
