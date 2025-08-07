import { axiosImageServer } from "@/lib/axios";
import { AxiosError } from "axios";

const end_point = "images";

export class ImageApi {
  static async uploadImage(
    file: File,
    tracingCallBack?: (percent: number) => void
  ): Promise<{ url: string }> {
    // Validation
    if (!file) {
      throw new Error("File không được để trống");
    }

    // Kiểm tra loại file
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Loại file không được hỗ trợ. Chỉ chấp nhận: JPEG, PNG, GIF, WebP"
      );
    }

    // Kiểm tra kích thước file (ví dụ: tối đa 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("File quá lớn. Kích thước tối đa là 5MB");
    }

    // Tạo FormData
    const formData = new FormData();
    formData.append("image", file);

    // Có thể thêm metadata khác nếu cần
    // formData.append('description', 'Image upload');
    // formData.append('category', 'product');

    try {
      const response = await axiosImageServer.post<{ url: string }>(
        `/${end_point}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              if (tracingCallBack) {
                tracingCallBack(percentCompleted);
              }
              console.log(`Upload progress: ${percentCompleted}%`);
            }
          },
          // Timeout cho upload file lớn
          timeout: 30000, // 30 seconds
        }
      );

      return {
        url: response.data.url,
      };
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;

        // Xử lý các lỗi thường gặp
        if (status === 413) {
          throw new Error("File quá lớn để upload");
        } else if (status === 415) {
          throw new Error("Loại file không được hỗ trợ");
        } else if (status === 400) {
          throw new Error(message || "Dữ liệu upload không hợp lệ");
        }

        console.error(`Lỗi API uploadImage: ${status} - ${message}`);
        throw new Error(`Không thể upload ảnh (${status})`);
      }

      console.error("Lỗi không xác định:", error);
      throw new Error("Đã có lỗi không xác định xảy ra khi upload ảnh");
    }
  }
}
