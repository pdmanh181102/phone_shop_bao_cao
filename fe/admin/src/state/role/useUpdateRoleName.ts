import { RoleApi } from '@api/role_api';
import { getMessageApi } from '@context/MessageContext';
import { useMutation } from '@tanstack/react-query';

export function useUpdateRoleName(onSuccess: () => void) {
    const updateNameMutation = useMutation({
        mutationFn: ({ role_uid, name }: { role_uid: string, name: string }) => RoleApi.updateName(role_uid, name),
        onSuccess: () => {
            getMessageApi().success("Đã cập nhật tên");
            onSuccess();
        },
        onError: (error: any) => {
            getMessageApi().error(error?.message || "Có lỗi xảy ra khi cập nhật tên thương hiệu");
        },
    });

    return { updateName: updateNameMutation.mutate, loading: updateNameMutation.isPending }
}
