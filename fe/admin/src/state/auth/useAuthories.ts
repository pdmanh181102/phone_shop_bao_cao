import { AuthStorage } from "@/uitl/auth_storage";
import { AuthApi } from "@api/auth_api";
import { getMessageApi } from "@context/MessageContext";
import { useMutation } from "@tanstack/react-query";
import { CheckLoginResponse } from "@type/auth";

export const useAuthories = (onSuccess: () => any) => {
  return useMutation<CheckLoginResponse, Error>({
    mutationFn: () => AuthApi.checkLogin(),
    onSuccess: ({ authorities, userUid }) => {
      AuthStorage.setAuthories(authorities);
      AuthStorage.setUserUid(userUid);
      onSuccess();
    },
    onError: (error) => {
      getMessageApi().error(error.message);
    },
  });
};
