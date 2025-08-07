import { AttributeItemApi } from "@/api/client/attribute_item_api";
import { useQuery } from "@tanstack/react-query";

export const useProductAttributeItemList = (attributeUid: string) => {
  return useQuery({
    queryKey: ["product_attribute_items", attributeUid],
    queryFn: () => AttributeItemApi.readAllByAttribute(attributeUid),
  });
};
