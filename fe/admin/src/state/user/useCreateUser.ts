import { UserApi } from '@api/user_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useCreateUser(onSuccess: () => void) {
    const createMutation = useMutation({
        mutationFn: (
            { firsrt_name, last_name, gender }:
                { firsrt_name: string, last_name: string, gender: string }) => UserApi.create(firsrt_name, last_name, gender),
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
