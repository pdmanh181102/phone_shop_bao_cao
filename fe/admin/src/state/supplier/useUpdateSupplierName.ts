import { SupplierApi } from '@api/supplier_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useUpdateSupplierName(onSuccess: () => void) {
    const updateNameMutation = useMutation({
        mutationFn: ({ supplier_uid, name }: { supplier_uid: string, name: string }) => SupplierApi.updateName(supplier_uid, name),
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
