import { Product } from "@/api/type/product";

export async function fetchProductOnServer(uid: string): Promise<Product> {
  const baseUrl = process.env.PHONE_SHOP_SERVER_HOST || "http://localhost:8080";

  const url = `${baseUrl}/products/${uid}`;

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

  return res.json();
}
