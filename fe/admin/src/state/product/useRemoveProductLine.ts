import { ProductApi } from '@api/product_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useRemoveProductLine(onSuccess: () => void) {
    const updateMutation = useMutation({
        mutationFn: ({ product_uid, product_line_uid }: { product_uid: string, product_line_uid: string }) => ProductApi.removeProductLine(product_uid, product_line_uid),
        onSuccess: () => {
            getMessageApi().success("Đã cập nhật");
            onSuccess();
        },
        onError: (error: any) => {
            getMessageApi().error(error?.message || "lỗi");
        },
    });

    return { removeProductLine: updateMutation.mutate, loading: updateMutation.isPending }
}
