import { axiosMainServer } from "@/lib/axios";
import axios from "axios";
import { Gender } from "../type/gender";

const end_point = "user-genders";

export class GenderApi {
    static async readAll(): Promise<Gender[]> {
        try {
            const response = await axiosMainServer.get<Gender[]>(`/${end_point}`);
            return response.data
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