import { BrandApi } from '@api/brand_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useUpdateBrandName(onSuccess: () => void) {
    const updateNameMutation = useMutation({
        mutationFn: ({ brand_uid, name }: { brand_uid: string, name: string }) => BrandApi.updateName(brand_uid, name),
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
