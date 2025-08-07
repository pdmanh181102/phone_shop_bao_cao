import { ProductApi } from '@api/product_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useUpdateProductStatus(onSuccess: () => void) {
    const updateMutation = useMutation({
        mutationFn: ({ product_uid, status }: { product_uid: string, status: string }) => ProductApi.updateStatus(product_uid, status),
        onSuccess: () => {
            getMessageApi().success("Đã cập nhật");
            onSuccess();
        },
        onError: (error: any) => {
            getMessageApi().error(error?.message || "lỗi");
        },
    });

    return { updateStatus: updateMutation.mutate, loading: updateMutation.isPending }
}
