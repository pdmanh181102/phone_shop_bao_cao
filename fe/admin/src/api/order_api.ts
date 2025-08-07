import { axiosMainServer } from "@lib/axios";
import { FetcherParams } from "@state/usePaginatedQuery";
import { Order } from "@type/order";
import { OrderItem } from "@type/order_item";
import { Page } from "@type/page";
import { AxiosError } from "axios";

const end_point = "orders";

export class OrderApi {
  static async readAllItems(entry_uid: string): Promise<OrderItem[]> {
    try {
      const response = await axiosMainServer.get<OrderItem[]>(
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
  }: FetcherParams): Promise<Page<Order>> {
    try {
      const response = await axiosMainServer.get<Page<Order>>(`/${end_point}`, {
        params: {
          page: page ? page - 1 : 0, // nếu backend 0-based
          size: size,
          sort: sortField
            ? `${sortField},${sortOrder === "descend" ? "desc" : "asc"}`
            : undefined,
          ...filters,
        },
      });
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
  static async readByUid(brand_uid: string): Promise<Order> {
    try {
      const response = await axiosMainServer.get<Order>(
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
    note: string,
    address: string,
    recipient_name: string,
    recipient_phone: string,
    payment_method_uid: string,
    items: { product_uid: string; quantity: number }[]
  ): Promise<Order> {
    try {
      const converted_items: {
        productUid: string;
        quantity: number;
      }[] = items.map((item) => ({
        productUid: item.product_uid,
        quantity: item.quantity,
      }));

      const response = await axiosMainServer.post<Order>(
        `/${end_point}`,
        {
          note,
          address,
          recipientName: recipient_name,
          recipientPhone: recipient_phone,
          paymentMethod: payment_method_uid,
          items: converted_items,
        },
        {
          params: {
            createdByStaff: true,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        throw new Error(message || "Lỗi");
      }
      console.log(error);

      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }

  static async updateStatus(uid: string, status: string): Promise<Order> {
    try {
      const response = await axiosMainServer.patch<Order>(
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
        console.error(`Lỗi API update order status: ${status} - ${message}`);
        throw new Error(
          message || `Không thể cập nhật trạng thái đơn hàng (${status})`
        );
      }
      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra");
    }
  }
}
