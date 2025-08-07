import { axiosMainServer } from "@lib/axios";
import { FetcherParams } from "@state/usePaginatedQuery";
import { Brand } from "@type/brand";
import { Page } from "@type/page";
import { Product } from "@type/product";
import { ProductLine } from "@type/product_line";
import { AxiosError } from "axios";

const end_point = "products";

export class ProductApi {
  static async readBrandByProductUid(product_uid: string): Promise<Brand> {
    try {
      const response = await axiosMainServer.get<Brand>(
        `/${end_point}/${product_uid}/brand`
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
  static async readAll(
    {
      search,
      brand_uids,
      status_uids,
      product_line_uids,
      product_uids,
    }: {
      search?: string;
      brand_uids?: string[];
      status_uids?: string[];
      product_uids?: string[];
      product_line_uids?: string[];
    },
    { page, size, sortField, sortOrder, filters }: FetcherParams
  ): Promise<Page<Product>> {
    try {
      const params: any = {
        page: page ? page - 1 : 0, // nếu backend 0-based
        size: size,
        sort: sortField
          ? `${sortField},${sortOrder === "descend" ? "desc" : "asc"}`
          : undefined,
        ...filters,
      };
      if (search) params["search"] = search;
      if (brand_uids && brand_uids?.length > 0)
        params["brandUids"] = brand_uids.join(",");
      if (status_uids && status_uids?.length > 0)
        params["statuses"] = status_uids.join(",");
      if (product_uids && product_uids?.length > 0)
        params["productUids"] = product_uids.join(",");
      if (product_line_uids && product_line_uids?.length > 0)
        params["productLineUids"] = product_line_uids.join(",");

      const response = await axiosMainServer.get<Page<Product>>(
        `/${end_point}`,
        {
          params,
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API getAllBrands: ${status} - ${message}`);
        throw new Error(`Không thể tải danh sách sản phẩm (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async readByUid(product_uid: string): Promise<Product> {
    try {
      const response = await axiosMainServer.get<Product>(
        `/${end_point}/${product_uid}`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        throw new Error(`Không thể tải sản phẩm (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async create(brand_uid: string, name: string): Promise<Product> {
    const trimmedName = name?.trim();

    if (!trimmedName || trimmedName.length === 0) {
      throw new Error("Tên không hợp lệ");
    }

    try {
      const response = await axiosMainServer.post<Product>(
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
        console.error(`Lỗi API create product: ${status} - ${message}`);
        throw new Error(`Không thể tạo sản phẩm (${status})`);
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
        throw new Error(`Không thể kiểm tra tên sản phẩm (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }

  static async updateName(uid: string, name: string): Promise<Product> {
    try {
      const response = await axiosMainServer.patch<Product>(
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
  static async updatePrice(uid: string, price: number): Promise<Product> {
    try {
      const response = await axiosMainServer.patch<Product>(
        `/${end_point}/${uid}/update/price`,
        null,
        {
          params: {
            price,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API update product price: ${status} - ${message}`);
        throw new Error(`Không thể cập nhật giá (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async updateStatus(uid: string, status: string): Promise<Product> {
    try {
      const response = await axiosMainServer.patch<Product>(
        `/${end_point}/${uid}/update/status`,
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
        console.error(`Lỗi API update brand name: ${status} - ${message}`);
        throw new Error(`Không thể cập nhật tên (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async deleteByUid(uid: string): Promise<Product> {
    try {
      const response = await axiosMainServer.delete<Product>(
        `/${end_point}/${uid}`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message: string = error.response?.data?.message || error.message;
        if (message.includes("ràng buộc")) throw new Error("Không thể xóa");
        throw new Error(message);
      }
      throw error;
    }
  }

  static async readAllProductLines(
    product_uid: string,
    is_connected: boolean
  ): Promise<Page<ProductLine>> {
    try {
      const response = await axiosMainServer.get<Page<ProductLine>>(
        `/${end_point}/${product_uid}/product-lines`,
        {
          params: {
            isConnected: is_connected,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        throw new Error(`Không thể tải danh sách product line (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }

  static async addProductLine(
    product_uid: string,
    product_line_uid: string
  ): Promise<void> {
    try {
      const response = await axiosMainServer.post<void>(
        `/${end_point}/${product_uid}/product-lines/${product_line_uid}`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(
          `Lỗi API update product line product: ${status} - ${message}`
        );
        throw new Error(`Không thể cập nhật add product line (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }

  static async removeProductLine(
    product_uid: string,
    product_line_uid: string
  ): Promise<void> {
    try {
      const response = await axiosMainServer.delete<void>(
        `/${end_point}/${product_uid}/product-lines/${product_line_uid}`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(
          `Lỗi API update product line product: ${status} - ${message}`
        );
        throw new Error(`Không thể cập nhật add product line (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
}
