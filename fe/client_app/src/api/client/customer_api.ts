import { axiosMainServer } from "@/lib/axios";
import axios, { AxiosError } from "axios";
import {
  CreateCustomer,
  Customer,
  UpdatePasswordResponse,
} from "../type/customer";
import { Order } from "../type/order";
import { VerifyOtpResponse } from "../type/otp";

const endPoint = "/customers";

export class CustomerApi {
  static async changePassword(
    uid: string,
    oldPassword: string,
    newPassword: string
  ): Promise<Customer> {
    try {
      const response = await axiosMainServer.patch<Customer>(
        `${endPoint}/${uid}/update/password`,
        null,
        {
          params: {
            oldPassword: oldPassword,
            password: newPassword,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API update account name: ${status} - ${message}`);
        throw new Error(`Không thể cập nhật tên (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }

  static async updateFirstName(
    uid: string,
    first_name: string
  ): Promise<Customer> {
    try {
      const response = await axiosMainServer.patch<Customer>(
        `${endPoint}/${uid}/update/first-name`,
        null,
        {
          params: {
            firstName: first_name,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API update user first name: ${status} - ${message}`);
        throw new Error(`Không thể cập nhật tên (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async updateLastName(
    uid: string,
    last_name: string
  ): Promise<Customer> {
    try {
      const response = await axiosMainServer.patch<Customer>(
        `${endPoint}/${uid}/update/last-name`,
        null,
        {
          params: {
            lastName: last_name,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API update user last name: ${status} - ${message}`);
        throw new Error(`Không thể cập nhật tên (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async updateGender(uid: string, gender: string): Promise<Customer> {
    try {
      const response = await axiosMainServer.patch<Customer>(
        `${endPoint}/${uid}/update/gender`,
        null,
        {
          params: {
            gender,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API update user gender: ${status} - ${message}`);
        throw new Error(`Không thể cập nhật (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async updateAddress(uid: string, address: string): Promise<Customer> {
    try {
      const response = await axiosMainServer.patch<Customer>(
        `${endPoint}/${uid}/update/address`,
        null,
        {
          params: {
            address,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API update user address: ${status} - ${message}`);
        throw new Error(`Không thể cập nhật địa chỉ (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async updatePhoneNumber(
    uid: string,
    phone_number: string
  ): Promise<Customer> {
    try {
      const response = await axiosMainServer.patch<Customer>(
        `${endPoint}/${uid}/update/phone-number`,
        null,
        {
          params: {
            phoneNumber: phone_number,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(
          `Lỗi API update user phone number: ${status} - ${message}`
        );
        throw new Error(`Không thể cập nhật số điện thoại (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }

  static async updatePhotoUrl(uid: string, url: string): Promise<Customer> {
    try {
      const response = await axiosMainServer.patch<Customer>(
        `${endPoint}/${uid}/update/photo`,
        null,
        {
          params: {
            url: url,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(
          `Lỗi API update account photo url: ${status} - ${message}`
        );
        throw new Error(`Không thể cập nhật hình ảnh (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }

  static async updatePasswordByEmail(
    email: string,
    newPassword: string
  ): Promise<UpdatePasswordResponse> {
    try {
      const response = await axiosMainServer.patch<UpdatePasswordResponse>(
        `${endPoint}/update/password/email`,
        {
          email,
          newPassword,
        }
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }

  static async resendOtp(key: string): Promise<VerifyOtpResponse> {
    try {
      const response = await axiosMainServer.post<VerifyOtpResponse>(
        `api/otp/send`,
        {
          key,
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API gửi OTP: ${status} - ${message}`);
        throw new Error(`Không thể gửi  OTP (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }

  static async verifyOtp(key: string, otp: string): Promise<VerifyOtpResponse> {
    try {
      const response = await axiosMainServer.post<VerifyOtpResponse>(
        `api/otp/verify`,
        {
          key,
          otp,
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

  static async register(data: CreateCustomer): Promise<Customer> {
    try {
      // Toản sửa lỗi mạnh gọi nhầm api cũ :)
      // const res = await axiosMainServer.post<Customer>(endPoint, data);
      const res = await axiosMainServer.post<Customer>("/customer-auth/register", data);
      return res.data;
    } catch (error: any) {
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

  static async readByUid(customerUid: string): Promise<Customer> {
    try {
      const response = await axiosMainServer.get<Customer>(
        `${endPoint}/${customerUid}`
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

  static async readAllOrder(customerUid: string): Promise<Order[]> {
    try {
      const response = await axiosMainServer.get<Order[]>(
        `${endPoint}/${customerUid}/orders`
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

  static async checkUsernameExists(customerUid: string): Promise<boolean> {
    try {
      const response = await axiosMainServer.get<{ exists: boolean }>(
        `${endPoint}/exists/username`,
        {
          params: {
            username: customerUid,
          },
        }
      );
      return response.data.exists;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
      throw error;
    }
  }

  static async checkEmailExists(username: string): Promise<boolean> {
    const trimmed_username = username?.trim();

    if (!trimmed_username || trimmed_username.length === 0) {
      throw new Error("Tên không hợp lệ");
    }
    try {
      const response = await axiosMainServer.get<{ exists: boolean }>(
        `${endPoint}/exists/email`,
        {
          params: {
            email: trimmed_username,
          },
        }
      );
      return Boolean(response.data?.exists);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API checkNameExists: ${status} - ${message}`);
        throw new Error(`Không thể kiểm tra tên tài khoản (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
}
