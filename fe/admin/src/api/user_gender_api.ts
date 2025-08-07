import { axiosMainServer } from "@lib/axios";
import { UserGender } from "@type/user_gender";
import { AxiosError } from "axios";

const end_point = "user-genders";

export class UserGenderApi {
  static async readAll(): Promise<UserGender[]> {
    try {
      const response = await axiosMainServer.get<UserGender[]>(`/${end_point}`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API getAllBrands: ${status} - ${message}`);
        throw new Error(`Không thể tải danh sách gender (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
}
