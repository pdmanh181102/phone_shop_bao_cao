package app.server.phone_shop.api.reviews;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import app.server.phone_shop.api.order_items.OrderItemEntity;
import app.server.phone_shop.api.order_items.OrderItemService;
import app.server.phone_shop.api.products.ProductEntity;
import app.server.phone_shop.api.products.ProductRepository;
import app.server.phone_shop.api.reviews.request_dto.ReviewRequestDto;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;
    private final OrderItemService orderItemService;
    private final ProductRepository productRepository;

    public ReviewDto create(ReviewRequestDto request) {
        if (reviewRepository.existsByOrderItem_Uid(request.getOrderItemUid())) {
            throw new RuntimeException("Đã đánh giá sản phẩm này");
        }

        OrderItemEntity orderItem = orderItemService.getEntityByUid(request.getOrderItemUid());

        ReviewEntity review = ReviewEntity.builder()
                .orderItem(orderItem)
                .reviewContent(request.getReviewContent())
                .star(request.getStar())
                .date(LocalDate.now())
                .build();

        reviewRepository.save(review);

        // Lấy product từ order item
        ProductEntity product = review.getOrderItem().getProduct();

        // Tính lại điểm trung bình
        Float averageStar = reviewRepository.calculateAverageStarByProductUid(product.getUid());
        product.setStar(averageStar);

        // Cập nhật product
        productRepository.save(product);

        return reviewMapper.toDto(review);
    }

    public boolean existsByOrderItemUid(UUID orderItemUid) {
        return reviewRepository.existsByOrderItem_Uid(orderItemUid);
    }

    List<ReviewEntity> findAllByOrderItem_Product_Uid(UUID productUid) {
        return reviewRepository.findAllByOrderItem_Product_Uid(productUid);
    }

    public List<ReviewDto> findAllByProductUid(UUID productUid) {
        List<ReviewEntity> entities = reviewRepository.findAllByProductUid(productUid);
        return entities.stream()
                .map(reviewMapper::toDto)
                .collect(Collectors.toList());
    }

}