import { AccountApi } from "@api/account_api";
import { getMessageApi } from "@context/MessageContext";
import { useMutation } from "@tanstack/react-query";

export const useActiveAccount = (onSuccess: () => any) => {
    const mutation = useMutation({
        mutationFn: ({ account_uid }: { account_uid: string }) => AccountApi.updateStatus(account_uid, "ACTIVE"),
        onSuccess: () => {
            getMessageApi().success("Xong");
            onSuccess();
        },
        onError: (error: any) => {
            getMessageApi().error(error?.message || "Lỗi");
        },
    });

    return { do: mutation.mutate, loading: mutation.isPending }
};
