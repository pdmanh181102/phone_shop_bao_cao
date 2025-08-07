import { ProductApi } from '@api/product_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useCreateProduct(onSuccess: () => void) {
    const createMutation = useMutation({
        mutationFn: ({ brand_uid, name }: { brand_uid: string, name: string }) => ProductApi.create(brand_uid, name),
        onSuccess: () => {
            getMessageApi().success("Đã thêm");
            onSuccess();
        },
        onError: (error: any) => {
            getMessageApi().error(error?.message || "Lỗi");
        },
    });

    return { create: createMutation.mutate, loading: createMutation.isPending }
}
