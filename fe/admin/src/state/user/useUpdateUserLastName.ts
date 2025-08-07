import { UserApi } from '@api/user_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useUpdateUserLastName(onSuccess: () => void) {
    const updateNameMutation = useMutation({
        mutationFn: ({ user_uid, last_name }: { user_uid: string, last_name: string }) => UserApi.updateLastName(user_uid, last_name),
        onSuccess: () => {
            getMessageApi().success("Đã cập nhật tên");
            onSuccess();
        },
        onError: (error: any) => {
            getMessageApi().error(error?.message || "lỗi");
        },
    });

    return { updateName: updateNameMutation.mutate, loading: updateNameMutation.isPending }
}
