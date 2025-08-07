import { axiosMainServer } from "@lib/axios";
import { FetcherParams } from "@state/usePaginatedQuery";
import { InventoryExport } from "@type/inventory_export";
import { InventoryExportItem } from "@type/inventory_export_item";
import { Page } from "@type/page";
import { AxiosError } from "axios";

const end_point = "inventory-exports";

export class InventoryExportApi {
  static async readAllItems(entry_uid: string): Promise<InventoryExportItem[]> {
    try {
      const response = await axiosMainServer.get<InventoryExportItem[]>(
        `/${end_point}/${entry_uid}/items`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(
          `Lỗi API get all inventory entry items: ${status} - ${message}`
        );
        throw new Error(
          `Không thể tải danh sách sản phẩm của phiếu nhập (${status})`
        );
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async readAll({
    page,
    size,
    sortField,
    sortOrder,
    filters,
  }: FetcherParams): Promise<Page<InventoryExport>> {
    try {
      const response = await axiosMainServer.get<Page<InventoryExport>>(
        `/${end_point}`,
        {
          params: {
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
        console.error(
          `Lỗi API get all inventory enties: ${status} - ${message}`
        );
        throw new Error(`Không thể tải danh sách phiếu nhập (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async readByUid(brand_uid: string): Promise<InventoryExport> {
    try {
      const response = await axiosMainServer.get<InventoryExport>(
        `/${end_point}/${brand_uid}`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(
          `Lỗi API read inventory entry by uid: ${status} - ${message}`
        );
        throw new Error(`Không thể tải phiếu nhập (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async create(
    supplier_uid: string,
    reason: string,
    items: { product_uid: string; quantity: number; unit_price: number }[]
  ): Promise<InventoryExport> {
    const converted_items: {
      productUid: string;
      quantity: number;
      unitPrice: number;
    }[] = items.map((item) => ({
      productUid: item.product_uid,
      quantity: item.quantity,
      unitPrice: item.unit_price,
    }));

    try {
      const response = await axiosMainServer.post<InventoryExport>(
        `/${end_point}`,
        {
          supplierUid: supplier_uid,
          reason,
          items: converted_items,
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API create inventory entry: ${status} - ${message}`);
        throw new Error(`Không thể tạo phiếu nhập (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async deleteByUid(uid: string): Promise<InventoryExport> {
    try {
      const response = await axiosMainServer.delete<InventoryExport>(
        `/${end_point}/${uid}`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Lỗi API delete brand by uid: ${status} - ${message}`);
        throw new Error(`Không thể xóa (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
}
