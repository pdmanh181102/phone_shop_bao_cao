import { AccountApi } from "@api/account_api";
import { getMessageApi } from "@context/MessageContext";
import { useMutation } from "@tanstack/react-query";

export const useForceChangePassword = (onSuccess: () => any) => {
    const mutation = useMutation({
        mutationFn: (
            { account_uid, password, password2 }:
                { account_uid: string, password: string, password2: string }) => {
            if (password != password2) {
                throw new Error("Mật khẩu không khớp")
            }
            return AccountApi.fUpdatePassword(account_uid, password)
        },
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
