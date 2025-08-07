package app.server.phone_shop.api.reviews.request_dto;

import java.util.UUID;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequestDto {

    @NotNull
    private UUID orderItemUid;

    @NotBlank
    private String reviewContent;

    @Min(1)
    @Max(5)
    private int star;
}