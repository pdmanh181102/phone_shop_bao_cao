import { axiosMainServer } from "@lib/axios";
import { AccountStatus } from "@type/account_status";
import { AxiosError } from "axios";

const end_point = "account-status";

export class AccountStatusApi {
  static async readAll(): Promise<AccountStatus[]> {
    try {
      const response = await axiosMainServer.get<AccountStatus[]>(
        `/${end_point}`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API get all account status: ${status} - ${message}`);
        throw new Error(`Không thể tải danh sách account status (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
}
