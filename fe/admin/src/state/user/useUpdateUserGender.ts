import { UserApi } from '@api/user_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useUpdateUserGender(onSuccess: () => void) {
    const updateNameMutation = useMutation({
        mutationFn: ({ user_uid, gender }: { user_uid: string, gender: string }) => UserApi.updateGender(user_uid, gender),
        onSuccess: () => {
            getMessageApi().success("Đã cập nhật");
            onSuccess();
        },
        onError: (error: any) => {
            getMessageApi().error(error?.message || "lỗi");
        },
    });

    return { updateName: updateNameMutation.mutate, loading: updateNameMutation.isPending }
}
