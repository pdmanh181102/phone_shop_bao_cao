import { ProductLineApi } from '@api/product_line_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useCheckProductLineName(onSuccess: () => any) {
    const checkNameMutation = useMutation({
        mutationFn: ({ brand_uid, name }: { brand_uid: string, name: string }) => ProductLineApi.checkNameExists(brand_uid, name),
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
