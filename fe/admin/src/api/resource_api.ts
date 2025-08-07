import { axiosMainServer } from "@lib/axios";
import { Resource } from "@type/resource";
import { AxiosError } from "axios";

const end_point = "resources";

export class ResourceApi {
  static async readAll(): Promise<Resource[]> {
    try {
      const response = await axiosMainServer.get<Resource[]>(`/${end_point}`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        throw new Error(`Không thể tải danh sách resources (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
}
