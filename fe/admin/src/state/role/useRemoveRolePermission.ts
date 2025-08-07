import { PrivilegeApi } from '@api/privilege_api';
import { RoleApi } from '@api/role_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useRemoveRolePermission(onSuccess: () => any) {
    const deleteMutation = useMutation({
        mutationFn: (privilege_uid: string) => PrivilegeApi.deleteByUid(privilege_uid),
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
