package app.server.phone_shop.api.permissions;

public enum PermissionEnum {
    READ_OWNER("Read owner"),
    READ_ALL("Read all"),
    WRITE("Write");

    private final String label;

    PermissionEnum(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
