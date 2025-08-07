import { AuthApi } from "@/api/client/auth_api";
import { LoginResponse } from "@/api/type/auth";
import { getMessageApi } from "@/context/MessageContext";
import { AuthStorage } from "@/util/auth_storage";
import { useMutation } from "@tanstack/react-query";

export const useLogin = (onSuccess?: () => any) => {
  return useMutation<
    LoginResponse,
    Error,
    { username: string; password: string }
  >({
    mutationFn: ({ username, password }) => AuthApi.login(username, password),
    onSuccess: ({ accountUid }) => {
      AuthStorage.setAccountUid(accountUid);
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      getMessageApi().error(error.message);
    },
  });
};
