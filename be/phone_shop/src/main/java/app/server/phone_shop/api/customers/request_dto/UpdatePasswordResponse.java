package app.server.phone_shop.api.customers.request_dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdatePasswordResponse {
    private boolean success;
    private String message;
}
