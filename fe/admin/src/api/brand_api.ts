import { axiosMainServer } from "@lib/axios";
import { FetcherParams } from "@state/usePaginatedQuery";
import { Brand } from "@type/brand";
import { Page } from "@type/page";
import { AxiosError } from "axios";

const end_point = "brands";

export class BrandApi {
  static async readAll({
    page,
    size,
    sortField,
    sortOrder,
    filters,
  }: FetcherParams): Promise<Page<Brand>> {
    try {
      const response = await axiosMainServer.get<Page<Brand>>(`/${end_point}`, {
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
        console.error(`Lỗi API get all brand: ${status} - ${message}`);
        throw new Error(`Không thể tải danh sách thương hiệu (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async readByUid(brand_uid: string): Promise<Brand> {
    try {
      const response = await axiosMainServer.get<Brand>(
        `/${end_point}/${brand_uid}`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API read brand by uid: ${status} - ${message}`);
        throw new Error(`Không thể tải thương hiệu (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async create(name: string): Promise<Brand> {
    const trimmedName = name?.trim();

    if (!trimmedName || trimmedName.length === 0) {
      throw new Error("Tên không hợp lệ");
    }

    try {
      const response = await axiosMainServer.post<Brand>(
        `/${end_point}`,
        null,
        {
          params: {
            name: trimmedName,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API createBrand: ${status} - ${message}`);
        throw new Error(`Không thể tạo thương hiệu (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async checkNameExists(name: string): Promise<boolean> {
    const trimmedName = name?.trim();

    if (!trimmedName || trimmedName.length === 0) {
      throw new Error("Tên không hợp lệ");
    }
    try {
      const response = await axiosMainServer.get<{ exists: boolean }>(
        `/${end_point}/exists`,
        {
          params: {
            name: trimmedName,
          },
        }
      );
      return Boolean(response.data?.exists);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API checkNameExists: ${status} - ${message}`);
        throw new Error(`Không thể kiểm tra tên thương hiệu (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async updatePhotoUrl(uid: string, url: string): Promise<Brand> {
    try {
      const response = await axiosMainServer.patch<Brand>(
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
        console.error(`Lỗi API update brand photo url: ${status} - ${message}`);
        throw new Error(`Không thể cập nhật hình ảnh (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async updateName(uid: string, name: string): Promise<Brand> {
    try {
      const response = await axiosMainServer.patch<Brand>(
        `/${end_point}/${uid}/update/name`,
        null,
        {
          params: {
            name,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API update brand name: ${status} - ${message}`);
        throw new Error(`Không thể cập nhật tên (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async deleteByUid(uid: string): Promise<Brand> {
    try {
      const response = await axiosMainServer.delete<Brand>(
        `/${end_point}/${uid}`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API delete brand by uid: ${status} - ${message}`);
        throw new Error(message || `Không thể xóa (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
}
