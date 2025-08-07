import { ProductLineApi } from '@api/product_line_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useDeleteProductLine(onSuccess: () => any) {
    const deleteMutation = useMutation({
        mutationFn: (product_line_uid: string) => ProductLineApi.deleteByUid(product_line_uid),
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
