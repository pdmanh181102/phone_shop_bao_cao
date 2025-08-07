import { ProductAttributeApi } from "@api/product_attribute_api";
import { getMessageApi } from "@context/MessageContext";
import { useMutation } from "@tanstack/react-query";

export function useCreateAttribute(product_uid: string, onSuccess: () => void) {
  const createMutation = useMutation({
    mutationFn: ({
      name,
      groupName,
      items,
    }: {
      name: string;
      groupName?: string;
      items: string[];
    }) =>
      ProductAttributeApi.create(product_uid, {
        name,
        groupName,
        items,
      }),
    onSuccess: () => {
      getMessageApi().success("Đã thêm");
      onSuccess();
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "Lỗi");
    },
  });

  return { create: createMutation.mutate, loading: createMutation.isPending };
}
