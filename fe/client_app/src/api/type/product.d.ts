export interface Product {
  uid: string;
  name: string;
  enteredQuantity: number;
  soldQuantity: number;
  currentQuantity: number;
  price: number;
  star: number;
  status: string;
}

export interface ProductStatus {
  uid: string;
  label: string;
}

export interface ProductPhoto {
  uid: string;
  photoUrl: string;
  isDefault: boolean;
}

export interface ProductAttribute {
  uid: string;
  name: string;
  value: string;
  groupName: string;
}
