import { CustomerApi } from "@/api/client/customer_api";
import { getMessageApi } from "@/context/MessageContext";
import { useMutation } from "@tanstack/react-query";

export function useCheckEmail(onSuccess: () => any) {
  const checkNameMutation = useMutation({
    mutationFn: (username: string) => CustomerApi.checkEmailExists(username),
    onSuccess: (result) => {
      if (result) {
        getMessageApi().error("Email đã được sử dụng");
        return;
      }
      onSuccess();
    },
    onError: (error: Error) => {
      getMessageApi().error(error?.message || "Lỗi khi kiểm tra email.");
    },
  });

  return {
    checkName: checkNameMutation.mutate,
    loading: checkNameMutation.isPending,
  };
}
