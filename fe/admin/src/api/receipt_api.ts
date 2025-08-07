import { axiosMainServer } from "@lib/axios";
import { ReceiptCreateDto, ReceiptItem } from "@type/receipt";
import { Supplier } from "@type/supplier";
import { AxiosError } from "axios";

const endPoint = "inventory-receipts";

export class InventoryReceiptApi {
    static async getAllItems(uid: string): Promise<ReceiptItem[]> {
        try {
            const response = await axiosMainServer.get<ReceiptItem[]>(
                `/${endPoint}/${uid}/items`
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
    static async create(body: ReceiptCreateDto): Promise<Supplier> {
        try {
            const response = await axiosMainServer.post<Supplier>(
                `/${endPoint}`,
                body
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
