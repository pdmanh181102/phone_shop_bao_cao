import { ProductLineApi } from '@api/product_line_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useCreateProductLine(onSuccess: () => void) {
    const createMutation = useMutation({
        mutationFn: ({ brand_uid, name }: { brand_uid: string, name: string }) => ProductLineApi.create(brand_uid, name),
        onSuccess: () => {
            getMessageApi().success("Đã thêm");
            onSuccess();
        },
        onError: (error: any) => {
            getMessageApi().error(error?.message || "lỗi");
        },
    });

    return { create: createMutation.mutate, loading: createMutation.isPending }
}
