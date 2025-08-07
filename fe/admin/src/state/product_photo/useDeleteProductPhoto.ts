import { ProductPhotoApi } from '@api/product_photo_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useDeleteProductPhoto(onSuccess: () => any) {
    const deleteMutation = useMutation({
        mutationFn: (product_photo_uid: string) => ProductPhotoApi.deleteByUid(product_photo_uid),
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
