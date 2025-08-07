import { RoleApi } from '@api/role_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useDeleteRole(onSuccess: () => any) {
    const deleteMutation = useMutation({
        mutationFn: (role_uid: string) => RoleApi.deleteByUid(role_uid),
        onSuccess: () => {
            getMessageApi().success("Đã xóa");
            onSuccess();
        },
        onError: (error: any) => {
            getMessageApi().error(error?.message || "Lỗi");
        },
    });

    return { delete: deleteMutation.mutate, loading: deleteMutation.isPending }
}
