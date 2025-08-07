import { axiosMainServer } from "@lib/axios";
import { CheckLoginResponse, LoginResponse } from "@type/auth";
import { AxiosError } from "axios";

const end_point = "auth";

export class AuthApi {
  static async checkLogin(): Promise<CheckLoginResponse> {
    try {
      const response = await axiosMainServer.get<CheckLoginResponse>(
        `/${end_point}/check-login`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
      throw error;
    }
  }
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
