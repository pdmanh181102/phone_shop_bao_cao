import { ProductApi } from '@api/product_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useDeleteProduct(onSuccess: () => any) {
    const deleteMutation = useMutation({
        mutationFn: (product_uid: string) => ProductApi.deleteByUid(product_uid),
        onSuccess: () => {
            getMessageApi().success("Đã xóa");
            onSuccess();
        },
        onError: (error: any) => {
            getMessageApi().error(error?.message || "Lỗi");
        },
    });

    return { delete: deleteMutation.mutate, loading: deleteMutation.isPending }
}
