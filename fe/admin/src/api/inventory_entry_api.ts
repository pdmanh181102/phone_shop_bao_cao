import { axiosMainServer } from "@lib/axios";
import { FetcherParams } from "@state/usePaginatedQuery";
import { InventoryEntry } from "@type/inventory_entry";
import { InventoryEntryItem } from "@type/inventory_entry_item";
import { Page } from "@type/page";
import { Receipt } from "@type/receipt";
import { AxiosError } from "axios";

const endPoint = "inventory-entries";

export class InventoryEntryApi {
  static async getReceipt(uid: string, ): Promise<Receipt> {
    try {
      const response = await axiosMainServer.get<Receipt>(
        `/${endPoint}/${uid}/receipt`, 
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
      throw error;
    }
  }
  static async readAllItems(entry_uid: string): Promise<InventoryEntryItem[]> {
    try {
      const response = await axiosMainServer.get<InventoryEntryItem[]>(
        `/${endPoint}/${entry_uid}/items`
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
  }: FetcherParams): Promise<Page<InventoryEntry>> {
    try {
      const response = await axiosMainServer.get<Page<InventoryEntry>>(
        `/${endPoint}`,
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
  static async readByUid(brand_uid: string): Promise<InventoryEntry> {
    try {
      const response = await axiosMainServer.get<InventoryEntry>(
        `/${endPoint}/${brand_uid}`
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
  ): Promise<InventoryEntry> {
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
      const response = await axiosMainServer.post<InventoryEntry>(
        `/${endPoint}`,
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
  static async deleteByUid(uid: string): Promise<InventoryEntry> {
    try {
      const response = await axiosMainServer.delete<InventoryEntry>(
        `/${endPoint}/${uid}`
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
