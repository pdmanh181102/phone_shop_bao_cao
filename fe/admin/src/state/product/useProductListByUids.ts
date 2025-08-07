import { ProductApi } from "@api/product_api";
import { getMessageApi } from "@context/MessageContext";
import { useMutation } from "@tanstack/react-query";

export const useProductListByUids = (onSuccess: (_: any) => any) => {
    return useMutation({
        mutationFn: ({ product_uids }: { product_uids: string[] }) => ProductApi.readAll({ product_uids }, {}),
        onSuccess: (result) => onSuccess(result),
        onError: (error: any) => {
            const message = error?.message || "Lỗi";
            getMessageApi().error(message)
        }
    });
};
