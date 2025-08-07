package app.server.phone_shop.api.user_genders;

public enum GenderEnum {
    MALE("Nam"),
    FE_MALE("Nữ"),
    ORTHER("Khác");

    private final String label;

    GenderEnum(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
