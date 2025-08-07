export interface Order {
  uid: string;
  note: string;
  address: string;
  recipientName: string;
  recipientPhone: string;
  paid: boolean;
  apptransid: string;
  zptransid: string;
  paymentMethod: string;
  userUid: string;
  statusUid: string;
  customerUid: string;
  status: string;
  staffUid: string;
  totalAmount: number;
  shippingAmount: number;
  paymentAmount: number;
  paymentDiscountAmount: number;
  paymentRefundId: string;
  createdAt: Date;
}

export enum OrderStatusEnumLabel {
  CHUA_THANH_TOAN = "Chưa thanh toán",
  CHO_XU_LY = "Đang chờ xử lý",
  DANG_GIAO_HANG = "Đang giao hàng",
  DA_GIAO_HANG = "Đã giao hàng",
  DA_HUY = "Đã hủy",
  GIAO_HANG_THAT_BAI = "Giao hàng thất bại",
  DA_HOAN_TIEN = "Đã hoàn tiền",
}

export enum OrderStatusEnum {
  CHUA_THANH_TOAN = "CHUA_THANH_TOAN",
  CHO_XU_LY = "CHO_XU_LY",
  DANG_GIAO_HANG = "DANG_GIAO_HANG",
  DA_GIAO_HANG = "DA_GIAO_HANG",
  DA_HUY = "DA_HUY",
  GIAO_HANG_THAT_BAI = "GIAO_HANG_THAT_BAI",
  DA_HOAN_TIEN = "DA_HOAN_TIEN",
}
