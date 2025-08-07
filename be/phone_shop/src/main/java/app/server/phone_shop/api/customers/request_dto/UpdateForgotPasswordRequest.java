package app.server.phone_shop.api.customers.request_dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateForgotPasswordRequest {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String newPassword;
}
