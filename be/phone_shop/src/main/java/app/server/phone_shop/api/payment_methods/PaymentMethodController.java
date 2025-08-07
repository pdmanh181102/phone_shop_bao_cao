package app.server.phone_shop.api.payment_methods;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/payment-methods")
@RequiredArgsConstructor
public class PaymentMethodController {

    @GetMapping("")
    public ResponseEntity<List<PaymentMethodDto>> getAll() {
        List<PaymentMethodDto> list = Arrays.stream(PaymentMethodEnum.values())
                .map(status -> new PaymentMethodDto(status.name(), status.getLabel()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

}
