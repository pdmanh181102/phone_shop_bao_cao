package app.server.phone_shop.api.customers;

import java.util.Date;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CustomerDto {
    private UUID uid;

    private String username;

    private String password;

    private String firstName;

    private String lastName;

    private String gender;

    private Date birthDay;

    private String address;

    private String phoneNumber;

    private String email;

    private String photoUrl;

    private String status;

}
