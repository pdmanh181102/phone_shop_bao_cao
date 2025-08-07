import { OrderApi } from '@api/order_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useComfirmOrder(onSuccess: () => void) {
    const updateNameMutation = useMutation({
        mutationFn: ({ order_uid }: { order_uid: string }) => OrderApi.updateStatus(order_uid, "DANG_GIAO_HANG"),
        onSuccess: () => {
            getMessageApi().success("Đã cập nhật");
            onSuccess();
        },
        onError: (error: any) => {
            getMessageApi().error(error?.message || "Lỗi");
        },
    });

    return { comfirmOrder: updateNameMutation.mutate, loading: updateNameMutation.isPending }
}
