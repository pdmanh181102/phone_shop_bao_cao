import { axiosMainServer } from "@/lib/axios";
import { AxiosError } from "axios";
import { Page } from "../type/page";
import { ProductAttribute } from "../type/product";
import { CompareProduct } from "../type/product.attribute";

const end_point = "product-attributes";

export class ProductAttributeApi {
  static async readAll(productUid?: string): Promise<ProductAttribute[]> {
    try {
      const response = await axiosMainServer.get<Page<ProductAttribute>>(
        `/${end_point}`,
        {
          params: {
            productUid: productUid,
            sort: "groupName,asc",
          },
        }
      );
      return response.data.content;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        throw new Error(
          `Không thể tải danh sách thuộc tính sản phẩm (${status})`
        );
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async getCompareProducts(productUids: string[]): Promise<CompareProduct[]> {
    try {
      // Tự tạo query string: productUids=a&productUids=b
      const queryParams = productUids.map(uid => `productUids=${encodeURIComponent(uid)}`).join('&');

      const response = await axiosMainServer.get<CompareProduct[]>(
        `/${end_point}/compare-products?${queryParams}`
      );

      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        throw new Error(`Không thể so sánh sản phẩm (${status}): ${message}`);
      }
      console.error('Lỗi không xác định:', error);
      throw new Error('Đã có lỗi không xác định xảy ra khi so sánh sản phẩm.');
    }
  }



}
