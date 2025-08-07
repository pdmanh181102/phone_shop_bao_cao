import { OrderApi } from '@api/order_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useCreateOrder(onSuccess: () => void) {

    const createMutation = useMutation({
        mutationFn: ({
            note,
            address,
            recipient_name,
            recipient_phone,
            payment_method_uid,
            items, }: {
                note: string;
                address: string;
                recipient_name: string;
                recipient_phone: string;
                payment_method_uid: string;
                items: {
                    product_uid: string, quantity: number
                }[]
            }) => OrderApi.create(note, address, recipient_name, recipient_phone, payment_method_uid, items),
        onSuccess: (result) => {
            onSuccess();
        },
        onError: (error: any) => {
            getMessageApi().error(error?.message || "lỗi");
        }
    });

    return { create: createMutation.mutate, loading: createMutation.isPending }
}
