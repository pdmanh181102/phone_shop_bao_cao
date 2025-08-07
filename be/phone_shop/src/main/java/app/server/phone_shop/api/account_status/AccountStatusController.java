package app.server.phone_shop.api.account_status;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/account-status")
@RequiredArgsConstructor
public class AccountStatusController {

    @GetMapping("")
    public ResponseEntity<List<AccountStatusDto>> getAll() {
        List<AccountStatusDto> list = Arrays.stream(AccountStatusEnum.values())
                .map(status -> new AccountStatusDto(status.name(), status.getLabel()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

}
