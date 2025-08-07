import { ImageApi } from '@api/image_api';
import { SupplierApi } from '@api/supplier_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';
import { useSupplier } from './useSupplier';

export function useUpdateSupplierPhotoWithUpload(supplier_uid: string) {
    const { refetch } = useSupplier({ supplier_uid });

    // Mutation 2: cập nhật url ảnh vào brand
    const updateBrandPhotoMutation = useMutation({
        mutationFn: (url: string) => SupplierApi.updatePhotoUrl(supplier_uid, url),
        onSuccess: () => {
            getMessageApi().info("Đã cập nhật hình ảnh");
            refetch();
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
