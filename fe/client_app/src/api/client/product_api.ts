import { axiosMainServer } from "@/lib/axios";
import { AxiosError } from "axios";
import { Page } from "../type/page";
import { Product } from "../type/product";

const end_point = "products";

export interface ReadAllProductParams {
  page?: number;
  search?: string;
  brandUid?: string;
}

export class ProductApi {
  static async readAll({
    page,
    search,
    brandUid,
  }: ReadAllProductParams): Promise<Page<Product>> {
    try {
      const params: any = {
        size: 10,
        statuses: "ACTIVE,DISCONTINUED",
      };
      if (search) params["search"] = search;
      if (brandUid) params["brandUids"] = brandUid;
      if (page) params["page"] = page - 1;

      const response = await axiosMainServer.get<Page<Product>>(
        `${end_point}`,
        {
          params,
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
  static async readByUids(productUids: string[]): Promise<Product[]> {
    try {
      const response = await axiosMainServer.get<Page<Product>>(
        `${end_point}`,
        {
          params: {
            productUids: productUids.join(","),
          },
        }
      );
      return response.data.content;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
      throw error;
    }
  }
  static async readByUid(product_uid: string): Promise<Product> {
    try {
      const response = await axiosMainServer.get<Product>(
        `${end_point}/${product_uid}`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        throw new Error(`Không thể tải sản phẩm (${status})`);
      }
      throw error;
    }
  }
}
