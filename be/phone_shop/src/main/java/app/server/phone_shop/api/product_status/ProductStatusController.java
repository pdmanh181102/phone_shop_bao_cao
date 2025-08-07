package app.server.phone_shop.api.product_status;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/product-status")
@RequiredArgsConstructor
public class ProductStatusController {

    @GetMapping("")
    public ResponseEntity<List<ProductStatusDto>> getAll() {
        List<ProductStatusDto> list = Arrays.stream(ProductStatusEnum.values())
                .map(status -> new ProductStatusDto(status.name(), status.getLabel()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

}
