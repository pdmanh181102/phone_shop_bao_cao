export interface OrderItem {
  uid: string;
  quantity: number;
  orderUid: string;
  productUid: string;
  price: number;
}

export interface Order {
  uid: string;
  note: string;
  address: string;
  status: string;
  statusUid: string;
  recipientName: string;
  recipientPhone: string;
  userUid: string;
  totalAmount: number;
  shippingAmount: number;
  createdAt: Date;
  paymentMethod: string;
}
