import { axiosMainServer } from "@lib/axios";
import { FetcherParams } from "@state/usePaginatedQuery";
import { InventoryAdjustment } from "@type/inventory_adjustment";
import { InventoryAdjustmentItem } from "@type/inventory_adjustment_item";
import { Page } from "@type/page";
import { AxiosError } from "axios";

const end_point = "inventory-adjustments";

export class InventoryAdjustmentApi {
  static async readAllItems(
    adjustment_uid: string
  ): Promise<InventoryAdjustmentItem[]> {
    try {
      const response = await axiosMainServer.get<InventoryAdjustmentItem[]>(
        `/${end_point}/${adjustment_uid}/items`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(
          `Lỗi API get all inventory adjustment items: ${status} - ${message}`
        );
        throw new Error(
          `Không thể tải danh sách sản phẩm của phiếu điều chỉnh tồn kho (${status})`
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
  }: FetcherParams): Promise<Page<InventoryAdjustment>> {
    try {
      const response = await axiosMainServer.get<Page<InventoryAdjustment>>(
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
          `Lỗi API get all inventory adjustments: ${status} - ${message}`
        );
        throw new Error(
          `Không thể tải danh sách phiếu điều chỉnh kho (${status})`
        );
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async readByUid(adjustment_uid: string): Promise<InventoryAdjustment> {
    try {
      const response = await axiosMainServer.get<InventoryAdjustment>(
        `/${end_point}/${adjustment_uid}`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(
          `Lỗi API read inventory adjustment by uid: ${status} - ${message}`
        );
        throw new Error(`Không thể tải phiếu điều chỉnh tồn kho (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
  static async create(
    reason: string,
    items: { product_uid: string; quantity: number }[]
  ): Promise<InventoryAdjustment> {
    const converted_items: {
      productUid: string;
      quantity: number;
    }[] = items.map((item) => ({
      productUid: item.product_uid,
      quantity: item.quantity,
    }));

    try {
      const response = await axiosMainServer.post<InventoryAdjustment>(
        `/${end_point}`,
        {
          reason,
          items: converted_items,
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(
          `Lỗi API create inventory adjustment: ${status} - ${message}`
        );
        throw new Error(`Không thể tạo phiếu điều chỉnh tồn kho (${status})`);
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
}
