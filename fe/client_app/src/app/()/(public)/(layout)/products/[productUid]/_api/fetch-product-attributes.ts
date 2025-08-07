import { Page } from "@/api/type/page";
import { ProductAttribute } from "@/api/type/product";

export interface ReadAllProductParams {
  page?: number;
  search?: string;
  brandUid?: string;
}

export async function fetchProductAttributesOnServer(
  uid: string
): Promise<ProductAttribute[]> {
  const baseUrl = process.env.PHONE_SHOP_SERVER_HOST || "http://localhost:8080";

  const url = `${baseUrl}/product-attributes`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch products: ${res.status} ${errorText}`);
  }

  const data: Page<ProductAttribute> =
    (await res.json()) as Page<ProductAttribute>;

  return data.content;
}
