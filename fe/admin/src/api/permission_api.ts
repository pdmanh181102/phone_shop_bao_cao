import { axiosMainServer } from "@lib/axios";
import { Permission } from "@type/permission";
import { AxiosError } from "axios";

const end_point = "permissions";

export class PermissionApi {
  static async readAll(): Promise<Permission[]> {
    try {
      const response = await axiosMainServer.get<Permission[]>(`/${end_point}`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        throw new Error(`Không thể tải danh sách permissions (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
}
