import { AxiosError } from "axios";
import { ProductPhoto } from "../type/product";
import { axiosMainServer } from "@/lib/axios";
import { Page } from "../type/page";

const end_point = "product-photos";

export class ProductPhotoApi {
  static async readProductAvatar(productUid?: string): Promise<ProductPhoto> {
    try {
      const response = await axiosMainServer.get<ProductPhoto>(
        `/${end_point}/product-avatar`,
        {
          params: {
            productUid: productUid,
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
  static async readAll(productUid?: string): Promise<ProductPhoto[]> {
    try {
      const response = await axiosMainServer.get<Page<ProductPhoto>>(
        `/${end_point}`,
        {
          params: {
            productUid: productUid,
          },
        }
      );
      return response.data.content;
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
}
