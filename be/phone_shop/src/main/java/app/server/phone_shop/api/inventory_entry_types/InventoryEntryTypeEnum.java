package app.server.phone_shop.api.inventory_entry_types;

public enum InventoryEntryTypeEnum {
    IMPORT("Nhập hàng"),
    RETURN("Hoàn trả hàng");

    private final String label;

    InventoryEntryTypeEnum(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
