import { InventoryEntryApi } from "@api/inventory_entry_api";
import { getMessageApi } from "@context/MessageContext";
import { useMutation } from "@tanstack/react-query";
import { InventoryEntry } from "@type/inventory_entry";

export const useImportMutation = (onSuccess: (entry: InventoryEntry)=>any) => {
const mutation = useMutation({
        mutationFn: (entryUid: string) => InventoryEntryApi.readByUid(entryUid),
        onSuccess: (result: InventoryEntry) => {
            onSuccess(result);
        },
        onError: (error: any) => {
            getMessageApi().error(error?.message || "Lỗi");
        },
    });

    return { mutate: mutation.mutate, loading: mutation.isPending }
};
