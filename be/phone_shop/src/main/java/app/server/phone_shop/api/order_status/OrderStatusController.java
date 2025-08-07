package app.server.phone_shop.api.order_status;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/order-status")
@RequiredArgsConstructor
public class OrderStatusController {

    @GetMapping("")
    public ResponseEntity<List<OrderStatusDto>> getAll() {
        List<OrderStatusDto> list = Arrays.stream(OrderStatusEnum.values())
                .map(status -> new OrderStatusDto(status.name(), status.getLabel()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

}
