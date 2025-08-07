import { axiosMainServer } from "@lib/axios";
import { AxiosError } from "axios";

const end_point = "payment";

export class PaymentApi {
  static async createPaymentOrder(
    order_uid: string,
    redirect_url: string
  ): Promise<any> {
    try {
      const response = await axiosMainServer.get<any>(
        `/${end_point}/pay-for-order`,
        {
          params: {
            orderUid: order_uid,
            redirectUrl: redirect_url,
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
