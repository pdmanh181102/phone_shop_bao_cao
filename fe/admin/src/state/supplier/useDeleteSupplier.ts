import { SupplierApi } from '@api/supplier_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useDeleteSupplier(onSuccess: () => any) {
    const deleteMutation = useMutation({
        mutationFn: (brand_uid: string) => SupplierApi.deleteByUid(brand_uid),
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
