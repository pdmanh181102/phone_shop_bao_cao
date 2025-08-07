import { axiosMainServer } from "@lib/axios";
import { FetcherParams } from "@state/usePaginatedQuery";
import { Page } from "@type/page";
import { ProductLine } from "@type/product_line";
import { AxiosError } from "axios";

const end_point = "product-lines";

export class ProductLineApi {
  static async readAll(
    brand_uid: string,
    { page, size, sortField, sortOrder, filters }: FetcherParams
  ): Promise<Page<ProductLine>> {
    try {
      const response = await axiosMainServer.get<Page<ProductLine>>(
        `/${end_point}`,
        {
          params: {
            brandUid: brand_uid,
            page: page ? page - 1 : 0, // nếu backend 0-based
            size: size,
            sort: sortField
              ? `${sortField},${sortOrder === "descend" ? "desc" : "asc"}`
              : undefined,
            ...filters,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API get all product lines: ${status} - ${message}`);
        throw new Error(`Không thể tải danh sách dòng sản phẩm (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async readByUid(brand_uid: string): Promise<ProductLine> {
    try {
      const response = await axiosMainServer.get<ProductLine>(
        `/${end_point}/${brand_uid}`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(
          `Lỗi API read product line by uid: ${status} - ${message}`
        );
        throw new Error(`Không thể tải dòng sản phẩm (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async create(brand_uid: string, name: string): Promise<ProductLine> {
    const trimmedName = name?.trim();

    if (!trimmedName || trimmedName.length === 0) {
      throw new Error("Tên không hợp lệ");
    }

    try {
      const response = await axiosMainServer.post<ProductLine>(
        `/${end_point}`,
        null,
        {
          params: {
            name: trimmedName,
            brandUid: brand_uid,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API createBrand: ${status} - ${message}`);
        throw new Error(`Không thể tạo dòng sản phẩm (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async checkNameExists(
    brand_uid: string,
    name: string
  ): Promise<boolean> {
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
            brandUid: brand_uid,
          },
        }
      );
      return Boolean(response.data?.exists);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API checkNameExists: ${status} - ${message}`);
        throw new Error(`Không thể kiểm tra tên dòng sản phẩm (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async updatePhotoUrl(uid: string, url: string): Promise<ProductLine> {
    try {
      const response = await axiosMainServer.patch<ProductLine>(
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
          `Lỗi API update product line photo url: ${status} - ${message}`
        );
        throw new Error(`Không thể cập nhật hình ảnh (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async updateName(uid: string, name: string): Promise<ProductLine> {
    try {
      const response = await axiosMainServer.patch<ProductLine>(
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
        console.error(
          `Lỗi API update product line name: ${status} - ${message}`
        );
        throw new Error(`Không thể cập nhật tên (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async deleteByUid(uid: string): Promise<ProductLine> {
    try {
      const response = await axiosMainServer.delete<ProductLine>(
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
