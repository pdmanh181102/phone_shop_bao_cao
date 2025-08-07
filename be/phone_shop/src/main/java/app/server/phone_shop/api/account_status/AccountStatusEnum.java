package app.server.phone_shop.api.account_status;

public enum AccountStatusEnum {
    ACTIVE("Active"),
    DISABLE("Disable");

    private final String label;

    AccountStatusEnum(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
