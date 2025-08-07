import { AuthStorage } from "@/uitl/auth_storage";
import { AuthApi } from "@api/auth_api";
import { getMessageApi } from "@context/MessageContext";
import { useMutation } from "@tanstack/react-query";
import { LoginResponse } from "@type/auth";

export const useLogin = (onSuccess: () => any) => {
  return useMutation<
    LoginResponse,
    Error,
    { username: string; password: string }
  >({
    mutationFn: ({ username, password }) => AuthApi.login(username, password),
    onSuccess: ({ accountUid }) => {
      AuthStorage.setAccountUid(accountUid);
      onSuccess();
    },
    onError: (error) => {
      getMessageApi().error(error.message);
    },
  });
};
