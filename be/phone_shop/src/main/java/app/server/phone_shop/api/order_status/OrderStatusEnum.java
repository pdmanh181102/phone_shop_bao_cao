package app.server.phone_shop.api.order_status;

public enum OrderStatusEnum {
    CHUA_THANH_TOAN("Chưa thanh toán"), // nếu là thanh toán online đây là trạng thái sau khi đặt hàng
    CHO_XU_LY("Đang chờ xử lý"), // Mới đặt hàng
    DANG_GIAO_HANG("Đang giao hàng"), // Đang vận chuyển
    DA_GIAO_HANG("Đã giao hàng"), // Đã nhận hàng
    DA_HUY("Đã hủy"), // Đơn hàng bị hủy
    GIAO_HANG_THAT_BAI("Giao hàng thất bại"), // Giao không thành công
    DA_HOAN_TIEN("Đã hoàn tiền"); // Giao không thành công

    private final String label;

    OrderStatusEnum(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
