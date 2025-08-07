import { axiosMainServer } from "@lib/axios";
import { Account } from "@type/account";
import { Page } from "@type/page";
import { Role } from "@type/role";
import { AxiosError } from "axios";

const end_point = "accounts";

export class AccountApi {
  static async readAll(): Promise<Page<Account>> {
    try {
      const response = await axiosMainServer.get<Page<Account>>(
        `/${end_point}`
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
  static async readByUid(account_uid: string | null): Promise<Account> {
    try {
      const response = await axiosMainServer.get<Account>(
        `/${end_point}/${account_uid}`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API read account by uid: ${status} - ${message}`);
        throw new Error(`Không thể tải tài khoản (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async create(
    user_uid: string,
    username: string,
    password: string
  ): Promise<Account> {
    const trimed_user_uid = user_uid?.trim();
    const trimed_username = username?.trim();
    const trimed_password = password?.trim();

    if (
      !trimed_user_uid ||
      trimed_user_uid.length === 0 ||
      !trimed_username ||
      trimed_username.length === 0 ||
      !trimed_password ||
      trimed_password.length === 0
    ) {
      throw new Error("Tên không hợp lệ");
    }

    try {
      const response = await axiosMainServer.post<Account>(
        `/${end_point}`,
        {
          username: username,
          password: password,
        },
        {
          params: {
            userUid: user_uid,
          },
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API createaccount: ${status} - ${message}`);
        throw new Error(`Không thể tạo tài khoản (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async checkNameExists(username: string): Promise<boolean> {
    const trimmed_username = username?.trim();

    if (!trimmed_username || trimmed_username.length === 0) {
      throw new Error("Tên không hợp lệ");
    }
    try {
      const response = await axiosMainServer.get<{ exists: boolean }>(
        `/${end_point}/exists`,
        {
          params: {
            username: trimmed_username,
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
  static async updatePhotoUrl(uid: string, url: string): Promise<Account> {
    try {
      const response = await axiosMainServer.patch<Account>(
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
        console.error(
          `Lỗi API update account photo url: ${status} - ${message}`
        );
        throw new Error(`Không thể cập nhật hình ảnh (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async updatePassword(uid: string, password: string): Promise<Account> {
    try {
      const response = await axiosMainServer.patch<Account>(
        `/${end_point}/${uid}/update/password`,
        null,
        {
          params: {
            password,
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
  static async fUpdatePassword(
    uid: string,
    password: string
  ): Promise<Account> {
    try {
      const response = await axiosMainServer.patch<Account>(
        `/${end_point}/${uid}/force-update/password`,
        null,
        {
          params: {
            password,
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
  static async updateStatus(uid: string, status_uid: string): Promise<Account> {
    try {
      const response = await axiosMainServer.patch<Account>(
        `/${end_point}/${uid}/update/status`,
        null,
        {
          params: {
            statusUid: status_uid,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API update account status: ${status} - ${message}`);
        throw new Error(`Không thể cập nhật status (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async deleteByUid(uid: string): Promise<Account> {
    try {
      const response = await axiosMainServer.delete<Account>(
        `/${end_point}/${uid}`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API delete account by uid: ${status} - ${message}`);
        throw new Error(`Không thể xóa (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }

  // role
  static async readAllRoles(account_uid: string): Promise<Role[]> {
    try {
      const response = await axiosMainServer.get<Role[]>(
        `/${end_point}/${account_uid}/roles`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API get all account roles: ${status} - ${message}`);
        throw new Error(`Không thể tải danh sách roles tài khoản (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }

  static async addRole(account_uid: string, role_uid: string): Promise<void> {
    try {
      const response = await axiosMainServer.post<void>(
        `/${end_point}/${account_uid}/roles`,
        null,
        {
          params: {
            roleUid: role_uid,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API update account role: ${status} - ${message}`);
        throw new Error(`Không thể cập account role(${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }

  static async removeRole(
    account_uid: string,
    role_uid: string
  ): Promise<void> {
    try {
      const response = await axiosMainServer.delete<void>(
        `/${end_point}/${account_uid}/roles/${role_uid}`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API update account role: ${status} - ${message}`);
        throw new Error(`Không thể cập account role(${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
}
