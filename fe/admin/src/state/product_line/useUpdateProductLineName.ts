import { ProductLineApi } from '@api/product_line_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useUpdateProductLineName(onSuccess: () => void) {
    const updateNameMutation = useMutation({
        mutationFn: ({ product_line_uid, name }: { product_line_uid: string, name: string }) => ProductLineApi.updateName(product_line_uid, name),
        onSuccess: () => {
            getMessageApi().success("Đã cập nhật tên");
            onSuccess();
        },
        onError: (error: any) => {
            getMessageApi().error(error?.message || "Có lỗi xảy ra khi cập nhật tên thương hiệu");
        },
    });

    return { updateName: updateNameMutation.mutate, loading: updateNameMutation.isPending }
}
