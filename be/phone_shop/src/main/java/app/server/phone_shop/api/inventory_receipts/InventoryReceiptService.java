package app.server.phone_shop.api.inventory_receipts;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import app.server.phone_shop.api.inventory_entries.InventoryEntryEntity;
import app.server.phone_shop.api.inventory_entries.InventoryEntryService;
import app.server.phone_shop.api.inventory_entry_items.InventoryEntryItemEntity;
import app.server.phone_shop.api.inventory_entry_items.InventoryEntryItemRepository;
import app.server.phone_shop.api.inventory_receipts.request_dto.CreateReceiptItemDto;
import app.server.phone_shop.api.products.ProductEntity;
import app.server.phone_shop.api.products.ProductRepository;
import app.server.phone_shop.api.products.ProductService;
import app.server.phone_shop.api.users.UserEntity;
import app.server.phone_shop.api.users.UserService;
import app.server.phone_shop.core.auth.AuthService;
import app.server.phone_shop.core.auth.AuthType;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InventoryReceiptService {

    private final InventoryReceiptRepository repository;
    private final InventoryEntryService entryService;
    private final ProductRepository productRepository;
    private final InventoryEntryItemRepository entryItemRepository;
    private final AuthService authService;
    private final UserService userService;
    private final ProductService productService;
    private final InventoryReceiptMapper mapper;

    @Transactional
    public InventoryReceiptDto create(UUID entryUid, String note, List<CreateReceiptItemDto> items) {
        InventoryEntryEntity entryEntity = entryService.getEntityByUid(entryUid);

        if (entryEntity.getReceipt() != null)
            throw new RuntimeException("Không thể nhập kho 2 lần cho một phiếu nhập!");

        String personType = authService.getCurrentUserType();
        if (personType != AuthType.STAFF) {
            throw new RuntimeException("Tài khoản không phải staff");
        }
        UUID userUid = authService.getCurrentUserUid();
        if (userUid == null) {
            throw new RuntimeException("Mã nhân viên không hợp lệ!");
        }
        UserEntity userEntity = userService.getEntityByUid(userUid);

        InventoryReceiptEntity receiptEntity = InventoryReceiptEntity.builder()
                .entry(entryEntity)
                .staff(userEntity)
                .note(note)
                .build();

        // List<InventoryReceiptItemEntity> receiptItems = new LinkedList<>();
        for (CreateReceiptItemDto item : items) {
            InventoryEntryItemEntity entryItemEntity = entryItemRepository.findById(item.getEntryItemUid())
                    .orElseThrow(() -> new RuntimeException("entry item không tồn tại!"));

            if (item.getQuantity() < 0)
                throw new RuntimeException("Số lượng sản phẩm không hợp lệ: " + entryItemEntity.getProduct().getName());

            entryItemEntity.setRealQuantity(item.getQuantity());

            entryItemRepository.save(entryItemEntity);

            // receiptItems.add(InventoryReceiptItemEntity.builder()
            // .entryItem(entryItemEntity)
            // .quantity(item.getQuantity())
            // .receipt(receiptEntity)
            // .build());

            ProductEntity productEntity = entryItemEntity.getProduct();
            productEntity.setEnteredQuantity(productEntity.getEnteredQuantity() + item.getQuantity());
            productEntity.setCurrentQuantity(productEntity.getCurrentQuantity() + item.getQuantity());
            productRepository.save(productEntity);
        }
        // receiptEntity.setItems(receiptItems);

        return mapper.toDto(repository.save(receiptEntity));
    }

    public InventoryReceiptDto getByEntryUid(UUID entryUid) {
        return mapper.toDto(repository.findByEntry_Uid(entryUid)
                .orElseThrow(() -> new RuntimeException("Phiếu nhập chưa có phiếu nhập kho!")));
    }

    public InventoryReceiptDto getByUid(UUID uid) {
        return mapper.toDto(getEntityByUid(uid));
    }

    public InventoryReceiptEntity getEntityByUid(UUID uid) {
        return repository.findById(uid).orElseThrow(() -> new RuntimeException("Phiếu nhập kho không tồn tại"));
    }
}
