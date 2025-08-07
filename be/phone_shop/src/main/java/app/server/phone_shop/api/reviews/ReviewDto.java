package app.server.phone_shop.api.reviews;

import java.time.LocalDate;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDto {
    private UUID uid;
    private String reviewContent;
    private int star;
    private LocalDate date;
    private UUID orderItemUid;
    private UUID productUid;
    private String productName;
    private String customerName; // cần thêm
}
