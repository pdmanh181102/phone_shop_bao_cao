import { AccountApi } from "@api/account_api";
import { getMessageApi } from "@context/MessageContext";
import { useMutation } from "@tanstack/react-query";

export const useAddRole = (onSuccess: () => any) => {
    const createMutation = useMutation({
        mutationFn: ({ account_uid, role_uid }: { account_uid: string, role_uid: string }) => AccountApi.addRole(account_uid, role_uid),
        onSuccess: () => {
            getMessageApi().success("Đã thêm");
            onSuccess();
        },
        onError: (error: any) => {
            getMessageApi().error(error?.message || "Lỗi");
        },
    });

    return { do: createMutation.mutate, loading: createMutation.isPending }
};
