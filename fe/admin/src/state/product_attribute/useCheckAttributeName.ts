import { ProductAttributeApi } from '@api/product_attribute_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useCheckAttributeName(product_uid: string, onSuccess: () => any) {
    const checkNameMutation = useMutation({
        mutationFn: (name: string) => ProductAttributeApi.checkNameExists(product_uid, name),
        onSuccess: (result) => {
            if (result) {
                getMessageApi().error("Tên đã được sử dụng");
                return;
            }
            onSuccess();
        },
        onError: (error: Error) => {
            getMessageApi().error(error?.message || "Lỗi khi kiểm tra tên.");
        },
    });

    return { checkName: checkNameMutation.mutate, loading: checkNameMutation.isPending }
}
