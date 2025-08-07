package app.server.phone_shop.api.payment_methods;

public enum PaymentMethodEnum {
    COD("COD"),
    ZALO_PAY("ZaloPay");

    private final String label;

    PaymentMethodEnum(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
