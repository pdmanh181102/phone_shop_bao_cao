import { axiosMainServer } from "@lib/axios";
import { Page } from "@type/page";
import { Privilege } from "@type/privilege";
import { AxiosError } from "axios";

const end_point = "role-privileges";

export class PrivilegeApi {
  static async readAll(role_uid: string): Promise<Page<Privilege>> {
    try {
      const response = await axiosMainServer.get<Page<Privilege>>(
        `/${end_point}`,
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
        console.error(
          `Lỗi API get all role privileges: ${status} - ${message}`
        );
        throw new Error(`Không thể tải danh sách privilege (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }

  static async create(
    role_uid: string,
    permission: string,
    resource: string
  ): Promise<Privilege> {
    try {
      const response = await axiosMainServer.post<Privilege>(
        `/${end_point}`,
        null,
        {
          params: {
            roleUid: role_uid,
            permission,
            resource,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API create privilege: ${status} - ${message}`);
        throw new Error(`Không thể tạo privilege (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }

  static async deleteByUid(uid: string): Promise<Privilege> {
    try {
      const response = await axiosMainServer.delete<Privilege>(
        `/${end_point}/${uid}`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(
          `Lỗi API delete product line by uid: ${status} - ${message}`
        );
        throw new Error(`Không thể xóa (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
}
