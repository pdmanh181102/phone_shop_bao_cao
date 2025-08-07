export enum OrderStatusModel {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  RETURN_REQUESTED = "RETURN_REQUESTED",
  RETURNING = "RETURNING",
  RETURNED = "RETURNED",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
}

export const OrderStatusLabel: Record<OrderStatusModel, string> = {
  [OrderStatusModel.PENDING]: "Đang chờ xử lý",
  [OrderStatusModel.CONFIRMED]: "Đã xác nhận",
  [OrderStatusModel.PROCESSING]: "Đang xử lý",
  [OrderStatusModel.SHIPPED]: "Đã giao cho đơn vị vận chuyển",
  [OrderStatusModel.DELIVERED]: "Đã giao hàng",
  [OrderStatusModel.RETURN_REQUESTED]: "Yêu cầu trả hàng",
  [OrderStatusModel.RETURNING]: "Đang hoàn trả",
  [OrderStatusModel.RETURNED]: "Đã trả hàng",
  [OrderStatusModel.CANCELLED]: "Đã hủy",
  [OrderStatusModel.FAILED]: "Giao hàng thất bại",
};
