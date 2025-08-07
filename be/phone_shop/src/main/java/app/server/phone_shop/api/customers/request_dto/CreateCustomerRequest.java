package app.server.phone_shop.api.customers.request_dto;

import java.sql.Date;
import java.util.UUID;

import app.server.phone_shop.api.user_genders.GenderEnum;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
public class CreateCustomerRequest {

    @Id
    @GeneratedValue(generator = "UUID")
    @Column
    private UUID uid;

    private String username;

    private String password;

    private String firstName;

    private String lastName;

    private GenderEnum gender;

    private Date birthDay;

    private String address;

    private String phoneNumber;

    private String email;

}
