import { axiosMainServer } from "@/lib/axios";
import { AxiosError } from "axios";
import { LoginResponse } from "../type/auth";

const end_point = "customer-auth";

export class AuthApi {
  static async login(
    username: string,
    password: string
  ): Promise<LoginResponse> {
    try {
      const response = await axiosMainServer.post<LoginResponse>(
        `/${end_point}/login`,
        {
          username,
          password,
        }
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
