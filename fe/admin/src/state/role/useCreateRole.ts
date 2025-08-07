import { RoleApi } from '@api/role_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useCreateRole(onSuccess: () => void) {
    const createMutation = useMutation({
        mutationFn: ({ name }: { name: string }) => RoleApi.create(name),
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
