import { axiosMainServer } from "@/lib/axios";
import axios from "axios";
import { Brand } from "../type/brand";
import { Page } from "../type/page";

const endPoint = "brands";

export class BrandApi {
  static async readAll(): Promise<Brand[]> {
    try {
      const response = await axiosMainServer.get<Page<Brand>>(`/${endPoint}`);
      return response.data.content;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Lỗi từ máy chủ";
        throw new Error(message);
      }
      throw new Error("Không thể kết nối đến máy chủ");
    }
  }
}
