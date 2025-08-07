import { InventoryReceiptApi } from '@api/receipt_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';
import { ReceiptCreateDto } from '@type/receipt';

export function useCreateReceipt(onSuccess?: () => void) {
    const createMutation = useMutation({
        mutationFn: (dto:ReceiptCreateDto ) => InventoryReceiptApi.create(dto),
        onSuccess: () => {
            getMessageApi().success("Đã thêm");
            onSuccess?.();
        },
        onError: (error: any) => {
            getMessageApi().error(error?.message || "Lỗi");
        },
    });

    return { create: createMutation.mutate, loading: createMutation.isPending }
}
