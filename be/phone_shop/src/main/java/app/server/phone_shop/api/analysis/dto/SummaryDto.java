package app.server.phone_shop.api.analysis.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SummaryDto {
    private Instant createdAt; // Or Date
    private Long totalQuantity; // Or Integer
    private BigDecimal money; // Or Double

    public SummaryDto(Instant createdAt, BigDecimal money) {
        this.createdAt = createdAt;
        this.money = money;
    }
}
