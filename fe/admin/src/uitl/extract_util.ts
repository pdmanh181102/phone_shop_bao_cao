import { Product } from "@type/product";
import { formatNumberVN } from "./format_util";

export function getCurrentProductQuantity(product?: Product): string {
    if (!product) return "0"
    return formatNumberVN(product.currentQuantity);
}

export function getCurrentProductQuantityNumber(product?: Product): number {
    if (!product) return 0
    return product.currentQuantity;
}

export function getTotalProductQuantity(product?: Product): string {
    if (!product) return "0"
    return formatNumberVN(product.enteredQuantity);
}