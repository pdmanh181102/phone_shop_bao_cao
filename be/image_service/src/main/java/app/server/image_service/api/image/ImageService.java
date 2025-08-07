package app.server.image_service.api.image;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageService {
    private static final String UPLOAD_DIR = "uploads/";

    public String saveImage(MultipartFile imageFile) throws IOException {
        // Tạo thư mục nếu chưa tồn tại
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists())
            uploadDir.mkdirs();

        // Tạo tên file duy nhất
        String originalFileName = imageFile.getOriginalFilename();
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String storedFileName = UUID.randomUUID() + fileExtension;

        Path filePath = Paths.get(UPLOAD_DIR, storedFileName);
        Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return storedFileName;
    }

    public byte[] loadImage(String fileName) throws IOException {
        Path path = Paths.get(UPLOAD_DIR, fileName);
        if (!Files.exists(path)) {
            throw new FileNotFoundException("Ảnh không tồn tại: " + fileName);
        }
        return Files.readAllBytes(path);
    }
}
