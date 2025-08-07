import { PrivilegeApi } from '@api/privilege_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useCreatePrivilege(onSuccess: () => void) {
    const createMutation = useMutation({
        mutationFn: ({ role_uid, permission, resource }: { role_uid: string, permission: string, resource: string }) => PrivilegeApi.create(role_uid, permission, resource),
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
