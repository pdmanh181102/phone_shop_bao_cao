import { axiosMainServer } from "@/lib/axios";
import axios from "axios";
import { Product } from "../type/product";

const endPoint = "carts";

export class CartApi {
  static async readAllProduct(customerUid: string): Promise<Product[]> {
    try {
      const response = await axiosMainServer.get<Product[]>(
        `${endPoint}/${customerUid}/items`
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Lỗi từ máy chủ";
        throw new Error(message);
      }
      throw error;
    }
  }

  static async addCartItem(
    customerUid: string,
    productUid: string
  ): Promise<void> {
    try {
      const response = await axiosMainServer.post<void>(
        `${endPoint}/${customerUid}/items/${productUid}`
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Lỗi từ máy chủ";
        throw new Error(message);
      }
      throw error;
    }
  }

  static async removeCartItem(
    customerUid: string,
    productUid: string
  ): Promise<void> {
    try {
      const response = await axiosMainServer.delete<void>(
        `${endPoint}/${customerUid}/items/${productUid}`
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Lỗi từ máy chủ";
        throw new Error(message);
      }
      throw error;
    }
  }
}
