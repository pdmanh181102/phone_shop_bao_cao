import { BrandApi } from "@api/brand_api";
import { ImageApi } from "@api/image_api";
import { getMessageApi } from "@context/MessageContext";
import { useMutation } from "@tanstack/react-query";
import { UserApi } from "@api/user_api";

export function useUpdateUserPhotoWithUpload(whenSuccess: () => any) {
  const updateBrandPhotoMutation = useMutation({
    mutationFn: ({ userUid, url }: { userUid: string; url: string }) =>
      UserApi.updatePhotoUrl(userUid, url),
    onSuccess: () => {
      getMessageApi().info("Đã cập nhật hình ảnh");
      whenSuccess();
    },
    onError: (error: any) => {
      getMessageApi().error(
        error?.message || "Có lỗi xảy ra khi cập nhật hình ảnh"
      );
    },
  });

  // Mutation 1: upload ảnh
  const uploadImageAndUpdatePhoto = useMutation({
    mutationFn: async ({ userUid, file }: { userUid: string; file: File }) => {
      const result = await ImageApi.uploadImage(file);
      updateBrandPhotoMutation.mutate({ userUid, url: result.url });
      return result;
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "Có lỗi xảy ra khi tải ảnh lên");
    },
  });

  return {
    uploadImage: uploadImageAndUpdatePhoto.mutate,
    uploading: uploadImageAndUpdatePhoto.isPending,
    updating: updateBrandPhotoMutation.isPending,
  };
}
