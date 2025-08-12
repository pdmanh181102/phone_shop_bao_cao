package app.server.phone_shop.api.resources;

public enum ResourceEnum {
    ACCOUNT("Account"),
    USER("User"),
    ROLE("Role"),
    BRAND("Brand"),
    PRODUCT("Product"),
    SUPPLIER("Supplier"),
    INVENTORY("Inventory"),
    ORDER("Order"),
    ANALYSIS("Analysis"),
    CUSTOMER("Customter");

    private final String label;

    ResourceEnum(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
