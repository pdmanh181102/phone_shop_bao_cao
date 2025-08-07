import { ProductAttributeApi } from '@api/product_attribute_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useDeleteProductAttribute(onSuccess: () => any) {
    const deleteMutation = useMutation({
        mutationFn: (product_attribute_uid: string) => ProductAttributeApi.deleteByUid(product_attribute_uid),
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
