import { ImageApi } from '@api/image_api';
import { ProductPhotoApi } from '@api/product_photo_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useUploadProductPhoto(product_uid: string, onSuccess: () => any) {
    const updateBrandPhotoMutation = useMutation({
        mutationFn: (url: string) => ProductPhotoApi.create(product_uid, url),
        onSuccess: () => {
            getMessageApi().info("Đã cập nhật hình ảnh");
            onSuccess();
        },
        onError: (error: any) => {
            getMessageApi().error(error?.message || "Có lỗi xảy ra khi cập nhật hình ảnh");
        },
    });

    // Mutation 1: upload ảnh
    const uploadImageAndUpdatePhoto = useMutation({
        mutationFn: async (file: File) => {
            const result = await ImageApi.uploadImage(file);
            updateBrandPhotoMutation.mutate(result.url);
            return result;
        },
        onError: (error: any) => {
            getMessageApi().error(error?.message || "Có lỗi xảy ra khi tải ảnh lên");
        },
    });

    return {
        uploadImage: uploadImageAndUpdatePhoto.mutate,
        uploading: uploadImageAndUpdatePhoto.isPending,
        updating: updateBrandPhotoMutation.isPending,
    };
}
