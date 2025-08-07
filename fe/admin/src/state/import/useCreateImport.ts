import { InventoryEntryApi } from '@api/inventory_entry_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useCreateImport(onSuccess: () => void) {
    const createMutation = useMutation({
        mutationFn: (
            { supplier_uid, reason, items }:
                { supplier_uid: string, reason: string, items: { product_uid: string, quantity: number, unit_price: number }[] }) => InventoryEntryApi.create(supplier_uid, reason, items),
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
