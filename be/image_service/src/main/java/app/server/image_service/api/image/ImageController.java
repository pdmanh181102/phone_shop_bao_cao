package app.server.image_service.api.image;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import app.server.image_service.core.util.ServerInfoUtil;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;
    private final ServerInfoUtil serverInfoUtil;

    @PostMapping("")
    public ResponseEntity<?> uploadImage(@RequestParam MultipartFile image) {
        try {
            String savedFileName = imageService.saveImage(image);
            return ResponseEntity
                    .ok(Map.of(
                            "url",
                            String.format("http://%s/%s/%s", serverInfoUtil.getServerAddress(), "images",
                                    savedFileName)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi tải ảnh: " + e.getMessage());
        }
    }

    @GetMapping("/{imageName}")
    public ResponseEntity<byte[]> getImage(@PathVariable String imageName) {
        try {
            byte[] imageBytes = imageService.loadImage(imageName);

            // Xác định content-type theo đuôi file
            String extension = imageName.substring(imageName.lastIndexOf(".") + 1);
            MediaType mediaType = switch (extension.toLowerCase()) {
                case "png" -> MediaType.IMAGE_PNG;
                case "jpg", "jpeg" -> MediaType.IMAGE_JPEG;
                case "gif" -> MediaType.IMAGE_GIF;
                default -> MediaType.APPLICATION_OCTET_STREAM;
            };

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .body(imageBytes);
        } catch (FileNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}
