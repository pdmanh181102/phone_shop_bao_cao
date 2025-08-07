import { InventoryReceiptApi } from '@api/receipt_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';
import { ReceiptItem } from '@type/receipt';

export function useReceiptItemsMutation(onSuccess: (items: ReceiptItem[]) => any) {
    const createMutation = useMutation({
        mutationFn: (receiptUid: string ) => InventoryReceiptApi.getAllItems(receiptUid),
        onSuccess: (result: ReceiptItem[]) => {
            onSuccess(result);
        },
        onError: (error: any) => {
            getMessageApi().error(error?.message || "Lỗi");
        },
    });

    return { fetch: createMutation.mutate, loading: createMutation.isPending }
}
