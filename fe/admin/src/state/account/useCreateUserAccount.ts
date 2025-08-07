import { AccountApi } from '@api/account_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useCreateUserAccount(onSuccess: () => void) {
    const createMutation = useMutation({
        mutationFn: (
            { user_uid, username, password, password2 }:
                {
                    user_uid: string, username: string, password: string,
                    password2: string
                }) => {
            if (password != password2) {
                throw new Error("Mật khẩu không khớp!");
            }
            return AccountApi.create(user_uid, username, password);
        },
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
