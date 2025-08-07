import { OrderApi } from '@api/order_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useShippedOrder(onSuccess: () => void) {
    const updateNameMutation = useMutation({
        mutationFn: ({ order_uid }: { order_uid: string }) => OrderApi.updateStatus(order_uid, "DA_GIAO_HANG"),
        onSuccess: () => {
            getMessageApi().success("Đã cập nhật");
            onSuccess();
        },
        onError: (error: any) => {
            getMessageApi().error(error?.message || "Lỗi");
        },
    });

    return { shippedOrder: updateNameMutation.mutate, loading: updateNameMutation.isPending }
}
