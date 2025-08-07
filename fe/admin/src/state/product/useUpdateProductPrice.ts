import { ProductApi } from '@api/product_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useUpdateProductPrice(onSuccess: () => void) {
    const updateMutation = useMutation({
        mutationFn: ({ product_uid, price }: { product_uid: string, price: number }) => ProductApi.updatePrice(product_uid, price),
        onSuccess: () => {
            getMessageApi().success("Đã cập nhật");
            onSuccess();
        },
        onError: (error: any) => {
            getMessageApi().error(error?.message || "lỗi");
        },
    });

    return { updatePrice: updateMutation.mutate, loading: updateMutation.isPending }
}
