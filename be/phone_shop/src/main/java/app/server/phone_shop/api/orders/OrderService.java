package app.server.phone_shop.api.orders;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import app.server.phone_shop.api.customers.CustomerEntity;
import app.server.phone_shop.api.customers.CustomerService;
import app.server.phone_shop.api.inventory_export_items.InventoryExportItemEntity;
import app.server.phone_shop.api.inventory_exports.InventoryExportEntity;
import app.server.phone_shop.api.inventory_exports.InventoryExportRepository;
import app.server.phone_shop.api.mail.EmailService;
import app.server.phone_shop.api.order_items.OrderItemDto;
import app.server.phone_shop.api.order_items.OrderItemEntity;
import app.server.phone_shop.api.order_items.OrderItemMapper;
import app.server.phone_shop.api.order_status.OrderStatusEnum;
import app.server.phone_shop.api.orders.request_dto.CreateOrderItemDto;
import app.server.phone_shop.api.payment_methods.PaymentMethodEnum;
import app.server.phone_shop.api.product_status.ProductStatusEnum;
import app.server.phone_shop.api.products.ProductEntity;
import app.server.phone_shop.api.products.ProductRepository;
import app.server.phone_shop.api.products.ProductService;
import app.server.phone_shop.api.users.UserEntity;
import app.server.phone_shop.api.users.UserService;
import app.server.phone_shop.core.auth.AuthService;
import app.server.phone_shop.core.auth.AuthType;
import app.server.phone_shop.zalo_pay.service.ZaloPayService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final ProductRepository productRepository;
    private final InventoryExportRepository inventoryExportRepository;

    private final OrderRepository repository;
    private final OrderMapper mapper;
    private final AuthService authService;
    private final UserService userService;
    private final CustomerService customerService;
    private final ProductService productService;
    private final ZaloPayService zaloPayService;
    private final EmailService emailService;
    private final OrderItemMapper orderItemMapper;

    @Transactional
    public OrderDto create(
            Boolean createdByStaff,
            String note,
            String address,
            String recipientName,
            String recipientPhone,
            PaymentMethodEnum paymentMethodEnum,
            BigDecimal shippingAmount,
            List<CreateOrderItemDto> items) {
        try {

            OrderEntity order = null;
            if (createdByStaff) {
                order = staffCreateOrder();
            } else {
                order = customerCreateOrder();
            }

            BigDecimal totalAmount = new BigDecimal(0);
            if (shippingAmount != null) {
                order.setShippingAmount(shippingAmount);
            }

            Set<OrderItemEntity> orderItems = new HashSet<>();

            for (CreateOrderItemDto item : items) {
                ProductEntity productEntity = productService.getEntityByUid(item.getProductUid());
                if (productEntity.getStatus() != ProductStatusEnum.ACTIVE)
                    throw new RuntimeException("Trạng thái sản phẩm không sẵn sàng để đặt hàng");

                if (productEntity.getCurrentQuantity() < item.getQuantity()) {
                    throw new RuntimeException("số lượng hàng hóa hiện tại không đủ để tạo đơn hàng vui lòng thử lại!");
                }

                OrderItemEntity orderItem = OrderItemEntity.builder()
                        .product(productEntity)
                        .quantity(item.getQuantity())
                        .price(productEntity.getPrice())
                        .order(order)
                        .build();
                orderItems.add(orderItem);

                totalAmount = totalAmount.add(productEntity.getPrice().multiply(new BigDecimal(item.getQuantity())));
            }

            order.setNote(note);
            order.setAddress(address);
            order.setRecipientName(recipientName);
            order.setRecipientPhone(recipientPhone);
            order.setPaymentMethod(paymentMethodEnum);
            order.setItems(orderItems);
            if (paymentMethodEnum == PaymentMethodEnum.COD) {
                order.setStatus(OrderStatusEnum.CHO_XU_LY);
            } else {
                order.setStatus(OrderStatusEnum.CHUA_THANH_TOAN);
            }
            order.setTotalAmount(totalAmount);

            OrderDto orderDto = mapper.toDto(repository.save(order));
            if (!createdByStaff) {
                CustomerEntity customer = getCurrentCustomer();
                System.out.println(String.format("\n\nSEND MAIL FOR ORDER:%s\n\n\n", customer.getEmail()));
                List<OrderItemDto> orderItemsDto = order.getItems().stream()
                        .map(orderItemMapper::toDto)
                        .toList();
                emailService.sendOrderStatusEmail(customer.getEmail(), customer.getFirstName(), orderDto.getUid(),
                        orderItemsDto, order.getStatus());
            }

            return orderDto;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }

    }

    private OrderEntity staffCreateOrder() {

        OrderEntity order = OrderEntity.builder()
                .staff(getCurrentStaff())
                .shippingAmount(new BigDecimal(0))
                .build();
        return order;
    }

    private UserEntity getCurrentStaff() {
        String personType = authService.getCurrentUserType();
        if (personType != AuthType.STAFF) {
            throw new RuntimeException("Tài khoản không phải staff");
        }

        UUID userUid = authService.getCurrentUserUid();
        if (userUid == null) {
            throw new RuntimeException("Mã nhân viên không hợp lệ!");
        }

        UserEntity userEntity = userService.getEntityByUid(userUid);
        return userEntity;
    }

    private OrderEntity customerCreateOrder() {

        OrderEntity order = OrderEntity.builder()
                .customer(getCurrentCustomer())
                .shippingAmount(new BigDecimal(0))
                .build();

        return order;

    }

    private CustomerEntity getCurrentCustomer() {
        String personType = authService.getCurrentUserType();
        if (personType != AuthType.CUSTOMER) {
            throw new RuntimeException("Tài khoản không phải customer");
        }

        UUID customerUid = authService.getCurrentUserUid();
        if (customerUid == null) {
            throw new RuntimeException("Mã người dùng không hợp lệ!");
        }

        CustomerEntity customerEntity = customerService.getEntityByUid(customerUid);
        return customerEntity;
    }

    public OrderDto getByUid(UUID uid) {
        OrderEntity entity = getEntityByUid(uid);

        try {
            if (entity.getStatus() == OrderStatusEnum.DA_HUY) {
                int returnCode = zaloPayService.checkRefundOrder(uid);
                System.out.println("\n\nRETUNRN STATUAS: " + returnCode);
                if (returnCode == 1) {
                    entity.setStatus(OrderStatusEnum.DA_HOAN_TIEN);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return mapper.toDto(entity);
    }

    public OrderEntity getEntityByUid(UUID uid) {
        OrderEntity entity = repository.findById(uid).orElseThrow(() -> new EntityNotFoundException());
        return entity;
    }

    public Page<OrderDto> getAll(Set<OrderStatusEnum> statuses,
            Integer page, Integer size,
            String sort, String search) {
        String[] sortParts = (sort != null) ? sort.split(",") : new String[] { "id" };
        String sortBy = sortParts[0];
        Sort.Direction direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("desc"))
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        Sort sortObj = Sort.by(direction, sortBy);

        Specification<OrderEntity> spec = Specification.where(null);
        spec = spec.and(OrderSpecification.hasStatus(statuses));
        spec = spec.and(OrderSpecification.search(search));

        // Nếu page hoặc size null -> không phân trang, trả toàn bộ danh sách
        if (page == null || size == null) {
            List<OrderDto> result = repository.findAll(spec, sortObj)
                    .stream()
                    .map(mapper::toDto)
                    .toList();
            return new PageImpl<>(result); // Chuyển về Page để giữ kiểu trả về
        }

        // Có phân trang
        page = Math.max(page, 0);
        size = Math.max(size, 1);
        Pageable pageable = PageRequest.of(page, size, sortObj);

        Page<OrderEntity> entityPage = repository.findAll(spec, pageable);
        return entityPage.map(mapper::toDto);
    }

    @Transactional
    public OrderDto updateStatus(UUID uid, OrderStatusEnum status) {
        OrderEntity entity = getEntityByUid(uid);
        if (!isValidStatusChange(entity.getStatus(), status)) {
            throw new RuntimeException("Update status failed. target status not valid for current status!");
        }
        if (entity.getStatus() == OrderStatusEnum.CHUA_THANH_TOAN && status == OrderStatusEnum.CHO_XU_LY) {

        }
        if (entity.getStatus() == OrderStatusEnum.CHO_XU_LY && status == OrderStatusEnum.DANG_GIAO_HANG) {
            entity.setStaff(getCurrentStaff());
            InventoryExportEntity inventoryExportEntity = InventoryExportEntity.builder()
                    .order(entity)
                    .reason("Xuất kho cho đơn hàng: " + uid.toString())
                    .build();

            List<InventoryExportItemEntity> exportItems = new LinkedList<>();

            for (OrderItemEntity orderItem : entity.getItems()) {
                ProductEntity productEntity = productService.getEntityByUid(orderItem.getProduct().getUid());
                if (productEntity.getCurrentQuantity() < orderItem.getQuantity()) {
                    throw new RuntimeException("Số lượng hàng hóa hiện tại không đủ để xuất kho");
                }
                productEntity.setSoldQuantity(productEntity.getSoldQuantity() + orderItem.getQuantity());
                productEntity.setCurrentQuantity(productEntity.getCurrentQuantity() - orderItem.getQuantity());
                productRepository.save(productEntity);

                exportItems.add(InventoryExportItemEntity.builder()
                        .quantity(orderItem.getQuantity())
                        .unitPrice(orderItem.getPrice())
                        .product(orderItem.getProduct())
                        .export(inventoryExportEntity)
                        .build());
            }

            repository.save(entity);
            inventoryExportEntity.setItems(exportItems);
            inventoryExportRepository.save(inventoryExportEntity);
        }

        if (status == OrderStatusEnum.DA_GIAO_HANG) {
            if (entity.getPaid() == false) {
                entity.setPaid(true);
                repository.save(entity);
            }
        }

        if (status == OrderStatusEnum.DA_HOAN_TIEN) {
            if (entity.getPaid() == true) {
                try {
                    zaloPayService.refundOrder(entity.getUid());
                } catch (Exception e) {
                    throw new RuntimeException("Hoàn tiền thất bại!");
                }
            }
        }

        entity.setStatus(status);
        return mapper.toDto(repository.save(entity));
    }

    private boolean isValidStatusChange(OrderStatusEnum currentStatus, OrderStatusEnum targetStatus) {
        if (currentStatus == OrderStatusEnum.CHUA_THANH_TOAN) {
            return targetStatus == OrderStatusEnum.CHO_XU_LY || targetStatus == OrderStatusEnum.DA_HUY;
        }
        if (currentStatus == OrderStatusEnum.CHO_XU_LY) {
            return targetStatus == OrderStatusEnum.DANG_GIAO_HANG || targetStatus == OrderStatusEnum.DA_HUY;
        }
        if (currentStatus == OrderStatusEnum.DANG_GIAO_HANG) {
            return targetStatus == OrderStatusEnum.DA_GIAO_HANG || targetStatus == OrderStatusEnum.GIAO_HANG_THAT_BAI;
        }
        if (currentStatus == OrderStatusEnum.GIAO_HANG_THAT_BAI) {
            return targetStatus == OrderStatusEnum.DANG_GIAO_HANG || targetStatus == OrderStatusEnum.DA_HUY;
        }
        if (currentStatus == OrderStatusEnum.DA_HUY) {
            return targetStatus == OrderStatusEnum.DA_HOAN_TIEN;
        }

        return false;
    }

    public OrderDto deleteByUid(UUID uid) {
        OrderEntity entity = getEntityByUid(uid);
        repository.delete(entity);
        return mapper.toDto(entity);
    }
}
