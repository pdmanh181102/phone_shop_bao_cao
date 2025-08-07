import { axiosMainServer } from "@/lib/axios";
import { AxiosError } from "axios";
import { PaymentMethod } from "../type/payment_method";

const end_point = "payment-methods";

export class PaymentMethodApi {
  static async readAll(): Promise<PaymentMethod[]> {
    try {
      const response = await axiosMainServer.get<PaymentMethod[]>(
        `/${end_point}`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
      throw error;
    }
  }
}
