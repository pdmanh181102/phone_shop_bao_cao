import { AccountApi } from '@api/account_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useCheckAccountUsername(onSuccess: () => any) {
    const checkNameMutation = useMutation({
        mutationFn: (username: string) => AccountApi.checkNameExists(username),
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
