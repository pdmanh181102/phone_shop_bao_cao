import { axiosMainServer } from "@lib/axios";
import { PaymentMethod } from "@type/payment_method";
import { AxiosError } from "axios";

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
        throw new Error(
          `Không thể tải danh sách trạng thái sản phẩm (${status})`
        );
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
}
