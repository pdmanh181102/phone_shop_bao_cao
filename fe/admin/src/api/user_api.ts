import { axiosMainServer } from "@lib/axios";
import { FetcherParams } from "@state/usePaginatedQuery";
import { Account } from "@type/account";
import { Page } from "@type/page";
import { User } from "@type/user";
import { AxiosError } from "axios";

const end_point = "users";

export class UserApi {
  // account
  static async readAccountByUserUid(user_uid: string): Promise<Account> {
    try {
      const response = await axiosMainServer.get<Account>(
        `/${end_point}/${user_uid}/accounts`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(
          `Lỗi API read user account by user uid: ${status} - ${message}`
        );
        throw new Error(`Không thể tải user account (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  // user
  static async readAll({
    page,
    size,
    sortField,
    sortOrder,
    filters,
  }: FetcherParams): Promise<Page<User>> {
    try {
      const response = await axiosMainServer.get<Page<User>>(`/${end_point}`, {
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
        console.error(`Lỗi API get all user: ${status} - ${message}`);
        throw new Error(`Không thể tải danh sách user (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async readByUid(user_uid: string | null): Promise<User> {
    try {
      const response = await axiosMainServer.get<User>(
        `/${end_point}/${user_uid}`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API read user by uid: ${status} - ${message}`);
        throw new Error(`Không thể tải user (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async create(
    first_name: string,
    last_name: string,
    gender: string
  ): Promise<User> {
    const trimmed_first_name = first_name?.trim();
    const trimmed_last_name = last_name?.trim();

    if (
      !trimmed_first_name ||
      trimmed_first_name.length === 0 ||
      !trimmed_last_name ||
      trimmed_last_name.length === 0
    ) {
      throw new Error("Tên không hợp lệ");
    }

    try {
      const response = await axiosMainServer.post<User>(`/${end_point}`, null, {
        params: {
          firstName: trimmed_first_name,
          lastName: trimmed_last_name,
          gender,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API create user: ${status} - ${message}`);
        throw new Error(`Không thể tạo user (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async updatePhotoUrl(uid: string, url: string): Promise<User> {
    try {
      const response = await axiosMainServer.patch<User>(
        `/${end_point}/${uid}/update/photo`,
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
        throw new Error(message);
      }
      throw error;
    }
  }
  static async updateFirstName(uid: string, first_name: string): Promise<User> {
    try {
      const response = await axiosMainServer.patch<User>(
        `/${end_point}/${uid}/update/first-name`,
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
  static async updateLastName(uid: string, last_name: string): Promise<User> {
    try {
      const response = await axiosMainServer.patch<User>(
        `/${end_point}/${uid}/update/last-name`,
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
  static async updateGender(uid: string, gender: string): Promise<User> {
    try {
      const response = await axiosMainServer.patch<User>(
        `/${end_point}/${uid}/update/gender`,
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
  static async deleteByUid(uid: string): Promise<User> {
    try {
      const response = await axiosMainServer.delete<User>(
        `/${end_point}/${uid}`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API delete brand by uid: ${status} - ${message}`);
        throw new Error(`Không thể xóa (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
}
