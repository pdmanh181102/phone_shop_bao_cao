import { CustomerApi } from "@/api/client/customer_api";
import { getMessageApi } from "@/context/MessageContext";
import { useMutation } from "@tanstack/react-query";

export function useCheckUsername(onSuccess: () => any) {
  const checkNameMutation = useMutation({
    mutationFn: (username: string) => {
      return CustomerApi.checkUsernameExists(
        "c165f58e-adf3-4479-b3b8-900961a015c2"
      );
    },
    onSuccess: (result) => {
      if (result) {
        getMessageApi().error("Tên đã được sử dụng");
        return;
      }
      onSuccess();
    },
    onError: (error: Error) => {
      getMessageApi().error(error?.message || "Lỗi khi kiểm tra tên.");
    },
  });

  return {
    checkName: checkNameMutation.mutate,
    loading: checkNameMutation.isPending,
  };
}
