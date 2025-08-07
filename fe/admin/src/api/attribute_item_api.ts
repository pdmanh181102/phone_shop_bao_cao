import { axiosMainServer } from "@lib/axios";
import { AttributeItem } from "@type/attribute_item";
import { AxiosError } from "axios";

const end_point = "attributes-items";

export class AttributeItemApi {
  static async readAllByAttribute(
    attributeUid: string
  ): Promise<AttributeItem[]> {
    try {
      const response = await axiosMainServer.get<AttributeItem[]>(
        `/${end_point}`,
        {
          params: {
            attributeUid,
          },
        }
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
