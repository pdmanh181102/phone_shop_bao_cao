import { InventoryEntryApi } from '@api/inventory_entry_api';
import { useMutation } from '@tanstack/react-query';
import { Receipt } from '@type/receipt';

export function useReceiptMutation(onSuccess: (receipt: Receipt) => any) {
    const mutation = useMutation({
        mutationFn: (entryUid: string) => InventoryEntryApi.getReceipt(entryUid),
        onSuccess: (result: Receipt) => {
            onSuccess(result);
        },
        onError: (error: any) => {
            // getMessageApi().error(error?.message || "Lỗi");
        },
    });

    return { mutate: mutation.mutate, loading: mutation.isPending }
}
