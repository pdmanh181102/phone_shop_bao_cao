import { BrandApi } from '@api/brand_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useDeleteBrand(onSuccess: () => any) {
    const deleteMutation = useMutation({
        mutationFn: (brand_uid: string) => BrandApi.deleteByUid(brand_uid),
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
