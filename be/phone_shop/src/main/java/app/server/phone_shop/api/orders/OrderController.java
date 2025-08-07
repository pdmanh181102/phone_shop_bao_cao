package app.server.phone_shop.api.orders;

import java.util.Set;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import app.server.phone_shop.api.order_status.OrderStatusEnum;
import app.server.phone_shop.api.orders.request_dto.CreateOrderRequestDto;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

        private final OrderService service;

        // Boolean createdByStaff để biết có phải nhân viên tạo không? nếu nhân viên tạo
        // thì gán user_uid bằng null
        @PostMapping("")
        public ResponseEntity<OrderDto> create(@RequestParam(defaultValue = "false") Boolean createdByStaff,
                        @RequestBody CreateOrderRequestDto order) {
                System.out.println("\n\nOOOOOOOOOOOOOOOOOO:" + order.toString());
                return ResponseEntity.status(HttpStatus.CREATED).body(
                                service.create(
                                                createdByStaff,
                                                order.getNote(),
                                                order.getAddress(),
                                                order.getRecipientName(),
                                                order.getRecipientPhone(),
                                                order.getPaymentMethod(),
                                                order.getShippingAmount(),
                                                order.getItems()));
        }

        @GetMapping("/{uid}")
        public ResponseEntity<OrderDto> getByUid(@PathVariable UUID uid) {
                return ResponseEntity.status(HttpStatus.OK).body(
                                service.getByUid(uid));
        }

        @GetMapping("")
        public ResponseEntity<Page<OrderDto>> getAll(
                        @RequestParam(required = false) Set<OrderStatusEnum> statuses,
                        @RequestParam(required = false) String search,
                        @RequestParam(required = false) Integer page,
                        @RequestParam(required = false) Integer size,
                        @RequestParam(defaultValue = "createdAt,desc") String sort) {
                return ResponseEntity.status(HttpStatus.OK).body(
                                service.getAll(statuses, page, size, sort,
                                                search));
        }

        @PatchMapping("/{uid}/update/status")
        public ResponseEntity<OrderDto> updateStatus(@PathVariable UUID uid, @RequestParam OrderStatusEnum status) {
                return ResponseEntity.status(HttpStatus.OK).body(
                                service.updateStatus(uid, status));
        }

        @DeleteMapping("/{uid}")
        public ResponseEntity<OrderDto> deleteByUid(@PathVariable UUID uid) {
                return ResponseEntity.status(HttpStatus.OK).body(
                                service.deleteByUid(uid));
        }

}
