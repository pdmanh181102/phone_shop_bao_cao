export interface CartItemResponse {
  uid: string;
  quantity: number;
  userUid: string;
  productUid: string;
  productName: string;
  productPrice: number;
}

export interface CartItem {
  uid: string;
  quantity: number;
  product: {
    uid: string;
    name: string;
    price: number;
  };
}
