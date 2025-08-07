import { Page } from "@/api/type/page";
import { Product } from "@/api/type/product";

export interface ReadAllProductParams {
  page?: number;
  search?: string;
  brandUid?: string;
}

export async function fetchProductsOnServer({
  page,
  search,
  brandUid,
}: ReadAllProductParams): Promise<Page<Product>> {
  const baseUrl = process.env.PHONE_SHOP_SERVER_HOST || "http://localhost:8080";

  const params = new URLSearchParams({
    size: "10",
    statuses: "ACTIVE,DISCONTINUED",
  });

  if (search) params.set("search", search);
  if (brandUid) params.set("brandUids", brandUid);
  if (page) params.set("page", String(page - 1));

  const url = `${baseUrl}/products?${params.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ACCOUNT_UID: "SYSTEM", // hoặc lấy từ context nếu cần
      TYPE: "CUSTOMER",
    },
    cache: "no-store", // hoặc "force-cache" nếu muốn caching
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch products: ${res.status} ${errorText}`);
  }

  return res.json();
}
