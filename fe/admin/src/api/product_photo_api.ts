import { axiosMainServer } from "@lib/axios";
import { Page } from "@type/page";
import { ProductPhoto } from "@type/product_photo";
import { AxiosError } from "axios";

const end_point = "product-photos";

export class ProductPhotoApi {
  static async readProductAvatar(product_uid?: string): Promise<ProductPhoto> {
    try {
      const response = await axiosMainServer.get<ProductPhoto>(
        `/${end_point}/product-avatar`,
        {
          params: {
            productUid: product_uid,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API get product avatar: ${status} - ${message}`);
        throw new Error(`Không thể tải avatar sản phẩm (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async readAll(product_uid?: string): Promise<Page<ProductPhoto>> {
    try {
      const response = await axiosMainServer.get<Page<ProductPhoto>>(
        `/${end_point}`,
        {
          params: {
            productUid: product_uid,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API getAllBrands: ${status} - ${message}`);
        throw new Error(
          `Không thể tải danh sách thuộc tính sản phẩm (${status})`
        );
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async create(
    product_uid: string,
    photoUrl: string
  ): Promise<ProductPhoto> {
    const trimmedPhoto = photoUrl?.trim();

    if (!trimmedPhoto || trimmedPhoto.length === 0) {
      throw new Error("Tên không hợp lệ");
    }

    try {
      const response = await axiosMainServer.post<ProductPhoto>(
        `/${end_point}`,
        null,
        {
          params: {
            photoUrl: trimmedPhoto,
            productUid: product_uid,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API createBrand: ${status} - ${message}`);
        throw new Error(`Không thể tạo thuộc tính sản phẩm (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async setDefault(uid: string): Promise<ProductPhoto> {
    try {
      const response = await axiosMainServer.patch<ProductPhoto>(
        `/${end_point}/${uid}/update/set-default`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(
          `Lỗi API update product attribute name: ${status} - ${message}`
        );
        throw new Error(`Không thể đặt làm mặc định (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async deleteByUid(uid: string): Promise<ProductPhoto> {
    try {
      const response = await axiosMainServer.delete<ProductPhoto>(
        `/${end_point}/${uid}`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(
          `Lỗi API delete product attribute by uid: ${status} - ${message}`
        );
        throw new Error(`Không thể xóa (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
}
