import { axiosMainServer } from "@/lib/axios";
import { AxiosError } from "axios";
import { CreateReviewRequest, Review, ReviewResponse } from "../type/review";

const endPoint = "reviews";

export class ReviewApi {
  static async create(data: CreateReviewRequest): Promise<Review> {
    try {
      const res = await axiosMainServer.post<ReviewResponse>(`${endPoint}`, {
        orderItemUid: data.order_item_uid,
        reviewContent: data.review_content,
        star: data.star,
      });

      return {
        uid: res.data.uid,
        reviewContent: res.data.reviewContent,
        star: res.data.star,
        date: res.data.date,
        orderItemUid: res.data.orderItemUid,
        productUid: res.data.productUid,       // thêm vào
        productName: res.data.productName,     //thêm vào
        customerName: res.data.customerName,   // thêm vào
      };
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        throw new Error(`Không thể tạo đánh giá (${status}): ${message}`);
      }
      throw new Error("Lỗi không xác định khi tạo đánh giá");
    }
  }

  static async existsByOrderItem(orderItemUid: string): Promise<boolean> {
    try {
      const res = await axiosMainServer.get<boolean>(
        `${endPoint}/exists/order-item/${orderItemUid}`
      );
      return res.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        throw new Error(`Lỗi kiểm tra đánh giá (${status}): ${message}`);
      }
      throw new Error("Lỗi không xác định khi kiểm tra đánh giá");
    }
  }


  static async getAllByProduct(productUid: string): Promise<Review[]> {
    try {
      const res = await axiosMainServer.get<ReviewResponse[]>(
        `${endPoint}/product/${productUid}`
      );
      return res.data.map((r: { uid: any; reviewContent: any; star: any; date: any; orderItemUid: any; productUid: any; productName: any; customerName: any; }) => ({
        uid: r.uid,
        reviewContent: r.reviewContent,
        star: r.star,
        date: r.date,
        orderItemUid: r.orderItemUid,
        productUid: r.productUid,
        productName: r.productName,
        customerName: r.customerName,
      }));
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        throw new Error(`Không thể tải đánh giá (${status}): ${message}`);
      }
      throw new Error("Lỗi không xác định khi tải đánh giá");
    }
  }


}