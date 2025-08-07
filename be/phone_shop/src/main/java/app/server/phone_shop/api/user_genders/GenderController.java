package app.server.phone_shop.api.user_genders;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/user-genders")
@RequiredArgsConstructor
public class GenderController {

    @GetMapping("")
    public ResponseEntity<List<GenderDto>> getAll() {
        List<GenderDto> list = Arrays.stream(GenderEnum.values())
                .map(status -> new GenderDto(status.name(), status.getLabel()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

}
