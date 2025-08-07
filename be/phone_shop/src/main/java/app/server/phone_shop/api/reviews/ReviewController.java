package app.server.phone_shop.api.reviews;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.server.phone_shop.api.reviews.request_dto.ReviewRequestDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewDto> create(@Valid @RequestBody ReviewRequestDto request) {
        return ResponseEntity.ok(reviewService.create(request));
    }

    @GetMapping("/exists/order-item/{uid}")
    public boolean existsByOrderItem(@PathVariable UUID uid) {
        return reviewService.existsByOrderItemUid(uid);
    }

    @GetMapping("/product/{productUid}")
    public List<ReviewDto> findAllByProduct(@PathVariable UUID productUid) {
        return reviewService.findAllByProductUid(productUid);
    }

}