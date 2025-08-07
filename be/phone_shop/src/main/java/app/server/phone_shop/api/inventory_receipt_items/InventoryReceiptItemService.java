// package app.server.phone_shop.api.inventory_receipt_items;

// import java.util.List;
// import java.util.UUID;

// import org.springframework.stereotype.Service;

// import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor
// public class InventoryReceiptItemService {

// private final InventoryReceiptItemRepository inventoryReceiptItemRepository;
// private final InventoryReceiptItemMapper mapper;

// public List<InventoryReceiptItemDto> getItemsByReceiptUid(UUID receiptUid) {
// List<InventoryReceiptItemEntity> entities =
// inventoryReceiptItemRepository.findAllByReceipt_Uid(receiptUid);
// return entities.stream().map(mapper::toDto).toList();
// }
// }
