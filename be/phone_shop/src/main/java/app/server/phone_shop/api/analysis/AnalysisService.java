package app.server.phone_shop.api.analysis;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import app.server.phone_shop.api.analysis.dto.CountByStatusDto;
import app.server.phone_shop.api.analysis.dto.SummaryDto;
import app.server.phone_shop.api.customers.CustomerRepository;
import app.server.phone_shop.api.inventory_entries.InventoryEntryRepository;
import app.server.phone_shop.api.order_status.OrderStatusEnum;
import app.server.phone_shop.api.orders.OrderRepository;
import app.server.phone_shop.api.product_status.ProductStatusEnum;
import app.server.phone_shop.api.products.ProductRepository;
import app.server.phone_shop.api.users.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnalysisService {
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    private final InventoryEntryRepository inventoryEntryRepository;

    public Integer countAllProduct() {
        return productRepository.countAll();
    }

    public Integer countAllUser() {
        return userRepository.countAll();
    }

    public Integer countAllCustomer() {
        return customerRepository.countAll();
    }

    public Integer countAllOrder() {
        return orderRepository.countAll();
    }

    public List<CountByStatusDto> getProductCountByStatus() {
        Map<ProductStatusEnum, Long> statusCountMap = Arrays.stream(ProductStatusEnum.values())
                .collect(Collectors.toMap(Function.identity(), s -> 0L));
        List<Object[]> results = productRepository.countByStatus();
        for (Object[] row : results) {
            ProductStatusEnum status = (ProductStatusEnum) row[0];
            Long count = (Long) row[1];
            statusCountMap.put(status, count);
        }
        return statusCountMap.entrySet().stream()
                .map(entry -> new CountByStatusDto(entry.getKey().getLabel(), entry.getValue()))
                .collect(Collectors.toList());
    }

    public List<CountByStatusDto> getOrderCountByStatus() {
        Map<OrderStatusEnum, Long> statusCountMap = Arrays.stream(OrderStatusEnum.values())
                .collect(Collectors.toMap(Function.identity(), s -> 0L));
        List<Object[]> results = orderRepository.countByStatus();
        for (Object[] row : results) {
            OrderStatusEnum status = (OrderStatusEnum) row[0];
            Long count = (Long) row[1];
            statusCountMap.put(status, count);
        }
        return statusCountMap.entrySet().stream()
                .map(entry -> new CountByStatusDto(entry.getKey().getLabel(),
                        entry.getValue()))
                .collect(Collectors.toList());
    }

    public List<SummaryDto> getEntrySummaries(Instant startDate, Instant endDate) {
        return inventoryEntryRepository.getEntrySummaries(startDate, endDate);
    }

    public List<SummaryDto> getOrderSummaries(Instant startDate, Instant endDate) {
        List<Object[]> rawResults = orderRepository.getOrderSummariesRaw(startDate, endDate);

        return rawResults.stream()
                .map(row -> new SummaryDto(
                        (Instant) row[0],
                        (BigDecimal) row[1]))
                .toList();
    }
}
