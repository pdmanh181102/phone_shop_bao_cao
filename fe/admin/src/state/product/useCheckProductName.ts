import { ProductApi } from '@api/product_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useCheckProductName(onSuccess: () => any) {
    const checkNameMutation = useMutation({
        mutationFn: ({ brand_uid, name }: { brand_uid: string, name: string }) => ProductApi.checkNameExists(brand_uid, name),
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
