import { ProductAttributeApi } from "@/api/client/product_attribute_api";
import { ProductAttribute } from "@/api/type/product";
import { getMessageApi } from "@/context/MessageContext";
import { useMutation } from "@tanstack/react-query";

export const useProductAttributesMutation = (
  onSuccess: (attributes: ProductAttribute[]) => any
) => {
  return useMutation({
    mutationFn: (productUid: string) => ProductAttributeApi.readAll(productUid),
    onSuccess: (result) => onSuccess(result),
    onError: (error) => getMessageApi().error(error.message),
  });
};
