package app.server.phone_shop.api.product_status;

public enum ProductStatusEnum {
    ACTIVE("Hiển thị"),
    DISCONTINUED("Ngừng kinh doanh"),
    DISABLE("Ẩn");

    private final String label;

    ProductStatusEnum(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
