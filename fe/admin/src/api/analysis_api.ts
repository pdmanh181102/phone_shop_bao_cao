import { axiosMainServer } from "@lib/axios";
import { CountByStatusResponse } from "@type/analysis";
import axios, { AxiosError } from "axios";

const end_point = "analysis";

export class AnalysisApi {
  static async orderSummaries(
    startDate?: Date,
    endDate?: Date
  ): Promise<number> {
    try {
      const params: { startDate?: string; endDate?: string } = {};
      if (startDate) {
        params.startDate = startDate.toISOString(); // "2025-07-28T18:00:00.000Z"
      }
      if (endDate) {
        params.endDate = endDate.toISOString(); // "2025-07-29T00:00:00.000Z"
      }

      const response = await axiosMainServer.get<number>(
        `/${end_point}/orders/summary`,
        { params: params }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
      throw error;
    }
  }

  static async inventoryEntrySummaries(
    startDate?: Date,
    endDate?: Date
  ): Promise<number> {
    try {
      const params: { startDate?: string; endDate?: string } = {};
      if (startDate) {
        params.startDate = startDate.toISOString(); // "2025-07-28T18:00:00.000Z"
      }
      if (endDate) {
        params.endDate = endDate.toISOString(); // "2025-07-29T00:00:00.000Z"
      }

      const response = await axiosMainServer.get<number>(
        `/${end_point}/entries/summary`,
        { params: params }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
      throw error;
    }
  }

  static async countAllProduct(): Promise<number> {
    try {
      const response = await axiosMainServer.get<number>(
        `/${end_point}/products/count-all`
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

  static async countAllUser(): Promise<number> {
    try {
      const response = await axiosMainServer.get<number>(
        `/${end_point}/users/count-all`
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

  static async countAllCustomer(): Promise<number> {
    try {
      const response = await axiosMainServer.get<number>(
        `/${end_point}/customers/count-all`
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

  static async countAllOrder(): Promise<number> {
    try {
      const response = await axiosMainServer.get<number>(
        `/${end_point}/orders/count-all`
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

  static async countProductByStatus(): Promise<CountByStatusResponse[]> {
    try {
      const response = await axiosMainServer.get<CountByStatusResponse[]>(
        `/${end_point}/products/count-by-status`
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

  static async countOrderByStatus(): Promise<CountByStatusResponse[]> {
    try {
      const response = await axiosMainServer.get<CountByStatusResponse[]>(
        `/${end_point}/orders/count-by-status`
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
}
