import { axiosMainServer } from "@/lib/axios";
import { AxiosError } from "axios";

import { FetcherParams } from "@state/usePaginatedQuery";
import { Customer } from "@type/customer";
import { Page } from "@type/page";
import { Order } from "../type/order";

const endPoint = "/customers";

export class CustomerApi {
    static async readAll({
      page,
      size,
      sortField,
      sortOrder,
      filters,
    }: FetcherParams): Promise<Page<Customer>> {
      try {
        const response = await axiosMainServer.get<Page<Customer>>(`${endPoint}`, {
          params: {
            page: page ? page - 1 : 0, // nếu backend 0-based
            size: size,
            sort: sortField
              ? `${sortField},${sortOrder === "descend" ? "desc" : "asc"}`
              : undefined,
            ...filters,
          },
        });
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
  static async updateStatus(uid: string, status: "ACTIVE"| "DISABLE"): Promise<Customer> {
    try {
      const response = await axiosMainServer.patch<Customer>(
        `${endPoint}/${uid}/update/status`,
        null,
        {
          params: {
            status,
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
      throw error;
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
