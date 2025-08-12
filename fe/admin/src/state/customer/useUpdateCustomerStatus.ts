import { CustomerApi } from '@api/customer_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useUpdateCustomerStatus(onSuccess: () => void) {
    const mutation = useMutation({
        mutationFn: ({ customerUid, status }: { customerUid: string, status: "DISABLE" | "ACTIVE" }) => CustomerApi.updateStatus(customerUid, status),
        onSuccess: () => {
            getMessageApi().success("Đã cập nhật");
            onSuccess();
        },
        onError: (error: any) => {
            getMessageApi().error(error?.message || "Có lỗi xảy ra khi cập nhật");
        },
    });

    return { updateStatus: mutation.mutate, loading: mutation.isPending }
}
