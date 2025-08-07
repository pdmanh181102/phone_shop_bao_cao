import { axiosMainServer } from "@lib/axios";
import { Page } from "@type/page";
import { ProductAttribute } from "@type/product.attribute";
import { AxiosError } from "axios";

const end_point = "product-attributes";

export class ProductAttributeApi {
  static async readAllGroupNames(product_uid?: string): Promise<string[]> {
    try {
      const response = await axiosMainServer.get<string[]>(
        `/${end_point}/${product_uid}/group-names`,
        {
          params: {
            productUid: product_uid,
            sort: "groupName,asc",
          },
        }
      );
      return response.data;
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
  static async readAll(product_uid?: string): Promise<Page<ProductAttribute>> {
    try {
      const response = await axiosMainServer.get<Page<ProductAttribute>>(
        `/${end_point}`,
        {
          params: {
            productUid: product_uid,
            sort: "groupName,asc",
          },
        }
      );
      return response.data;
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
  static async readByUid(
    product_attribute_uid: string
  ): Promise<ProductAttribute> {
    try {
      const response = await axiosMainServer.get<ProductAttribute>(
        `/${end_point}/${product_attribute_uid}`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(
          `Lỗi API read product attribute by uid: ${status} - ${message}`
        );
        throw new Error(`Không thể tải thuộc tính sản phẩm (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async create(
    product_uid: string,
    {
      name,
      groupName,
      items,
    }: { name: string; groupName?: string; items: string[] }
  ): Promise<ProductAttribute> {
    const trimmedName = name?.trim();

    if (!trimmedName || trimmedName.length === 0) {
      throw new Error("Tên không hợp lệ");
    }

    const itemsString = items.join(",");

    try {
      const response = await axiosMainServer.post<ProductAttribute>(
        `/${end_point}`,
        null,
        {
          params: {
            name: trimmedName,
            groupName,
            items: itemsString,
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
  static async checkNameExists(
    product_uid: string,
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
            productUid: product_uid,
          },
        }
      );
      return Boolean(response.data?.exists);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API checkNameExists: ${status} - ${message}`);
        throw new Error(
          `Không thể kiểm tra tên thuộc tính sản phẩm (${status})`
        );
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async updateName(
    uid: string,
    name: string
  ): Promise<ProductAttribute> {
    try {
      const response = await axiosMainServer.patch<ProductAttribute>(
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
          `Lỗi API update product attribute name: ${status} - ${message}`
        );
        throw new Error(`Không thể cập nhật tên (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async updateValue(
    uid: string,
    value: string
  ): Promise<ProductAttribute> {
    try {
      const response = await axiosMainServer.patch<ProductAttribute>(
        `/${end_point}/${uid}/update/value`,
        null,
        {
          params: {
            value,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(
          `Lỗi API update product attribute name: ${status} - ${message}`
        );
        throw new Error(`Không thể cập nhật giá trị thuộc tính (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async updateGroupName(
    uid: string,
    group: string
  ): Promise<ProductAttribute> {
    try {
      const response = await axiosMainServer.patch<ProductAttribute>(
        `/${end_point}/${uid}/update/group`,
        null,
        {
          params: {
            group,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(
          `Lỗi API update product attribute name: ${status} - ${message}`
        );
        throw new Error(`Không thể cập nhật tên (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async deleteByUid(uid: string): Promise<ProductAttribute> {
    try {
      const response = await axiosMainServer.delete<ProductAttribute>(
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
