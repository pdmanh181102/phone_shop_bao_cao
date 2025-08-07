import { ProductAttributeApi } from "@api/product_attribute_api";
import { getMessageApi } from "@context/MessageContext";
import { useMutation } from "@tanstack/react-query";

export function useAttributeGroupNames(
  onSuccess: (groupNames: string[]) => any
) {
  const mutation = useMutation({
    mutationFn: (productUid: string) =>
      ProductAttributeApi.readAllGroupNames(productUid),
    onSuccess: (result: string[]) => {
      onSuccess(result);
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "Lỗi");
    },
  });

  return {
    getGroupNames: mutation.mutate,
    loading: mutation.isPending,
  };
}
