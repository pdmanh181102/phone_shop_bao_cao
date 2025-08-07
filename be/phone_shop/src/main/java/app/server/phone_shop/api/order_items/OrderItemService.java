package app.server.phone_shop.api.order_items;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderItemService {

    private final OrderItemRepository repository;
    private final OrderItemMapper mapper;

    public List<OrderItemDto> getAll(UUID orderUid) {

        Specification<OrderItemEntity> spec = Specification.where(null);
        spec = spec.and(OrderItemSpecification.hasOrderUid(orderUid));

        List<OrderItemDto> result = repository.findAll(spec)
                .stream()
                .map(mapper::toDto)
                .toList();
        return result;
    }

    public OrderItemEntity getEntityByUid(UUID uid) {
        return repository.findById(uid)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy OrderItem với UID: " + uid));
    }

}
