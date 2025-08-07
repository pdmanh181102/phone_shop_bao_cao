import { UserApi } from '@api/user_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useUpdateUserFirstName(onSuccess: () => void) {
    const updateNameMutation = useMutation({
        mutationFn: ({ user_uid, first_name }: { user_uid: string, first_name: string }) => UserApi.updateFirstName(user_uid, first_name),
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
