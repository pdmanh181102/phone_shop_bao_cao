package app.server.phone_shop.api.analysis.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CountByStatusDto {
    private String type;
    private Long value;
}
