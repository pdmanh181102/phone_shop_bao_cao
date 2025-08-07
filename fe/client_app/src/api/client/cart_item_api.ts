import { axiosMainServer } from "@/lib/axios";
import { CartItem, CartItemResponse } from "../type/cart_item";

export function mapCartItem(res: CartItemResponse): CartItem {
  return {
    uid: res.uid,
    quantity: res.quantity,
    product: {
      uid: res.productUid,
      name: res.productName,
      price: res.productPrice,
    },
  };
}

export function mapCartItemList(responses: CartItemResponse[]): CartItem[] {
  return responses.map(mapCartItem);
}

// const user_uid = "88888888-4444-4444-4444-121212121212";
const user_uid = localStorage.getItem("user_uid");
const endpoint = `/users/${user_uid}/cart-items`;

export class CartItemApi {
  static async readAll(): Promise<CartItem[]> {
    const res = await axiosMainServer.get<CartItemResponse[]>(endpoint);
    return mapCartItemList(res.data);
  }

  static async create(product_uid: string, quantity: number): Promise<void> {
    await axiosMainServer.post(endpoint, {
      productUid: product_uid,
      quantity,
    });
  }

  static async update(product_uid: string, quantity: number): Promise<void> {
    await axiosMainServer.put(endpoint, {
      productUid: product_uid,
      quantity,
    });
  }

  static async delete(product_uid: string): Promise<void> {
    await axiosMainServer.delete(`${endpoint}/${product_uid}`);
  }
}
