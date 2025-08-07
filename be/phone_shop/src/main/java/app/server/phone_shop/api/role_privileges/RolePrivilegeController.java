package app.server.phone_shop.api.role_privileges;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import app.server.phone_shop.api.permissions.PermissionEnum;
import app.server.phone_shop.api.resources.ResourceEnum;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/role-privileges")
@RequiredArgsConstructor
public class RolePrivilegeController {

    private final RolePrivilegeService service;

    @PostMapping("")
    public ResponseEntity<RolePrivilegeDto> create(@RequestParam UUID roleUid, @RequestParam PermissionEnum permission,
            @RequestParam ResourceEnum resource) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                service.create(roleUid, permission, resource));
    }

    @GetMapping("")
    public ResponseEntity<Page<RolePrivilegeDto>> getAll(
            @RequestParam UUID roleUid,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "uid,asc") String sort) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.getAll(roleUid, page, size, sort));
    }

    @DeleteMapping("/{uid}")
    public ResponseEntity<RolePrivilegeDto> deleteByUid(@PathVariable UUID uid) {
        return ResponseEntity.status(HttpStatus.OK).body(
                service.deleteByUid(uid));
    }

}
