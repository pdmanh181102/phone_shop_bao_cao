import { ProductPhotoApi } from '@api/product_photo_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useSetDefaultProductPhoto(onSuccess: () => void) {
    const setDefaultMutation = useMutation({
        mutationFn: (product_photo_uid: string) => ProductPhotoApi.setDefault(product_photo_uid),
        onSuccess: () => {
            getMessageApi().success("Đã cập nhật ");
            onSuccess();
        },
        onError: (error: any) => {
            getMessageApi().error(error?.message || "lỗi");
        },
    });

    return { setDefault: setDefaultMutation.mutate, loading: setDefaultMutation.isPending }
}
