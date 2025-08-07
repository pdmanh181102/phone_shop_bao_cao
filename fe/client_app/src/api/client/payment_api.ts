import { axiosMainServer } from "@/lib/axios";
import { AxiosError } from "axios";

const end_point = "payment";

export class PaymentApi {
  static async createPaymentOrder(
    orderUid: string,
    redirectUrl: string
  ): Promise<any> {
    try {
      const response = await axiosMainServer.get<any>(
        `/${end_point}/pay-for-order`,
        {
          params: {
            orderUid,
            redirectUrl,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
}
