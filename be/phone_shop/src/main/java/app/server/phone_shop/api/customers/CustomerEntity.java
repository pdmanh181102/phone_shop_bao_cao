package app.server.phone_shop.api.customers;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

import app.server.phone_shop.api.account_status.AccountStatusEnum;
import app.server.phone_shop.api.orders.OrderEntity;
import app.server.phone_shop.api.products.ProductEntity;
import app.server.phone_shop.api.user_genders.GenderEnum;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "customers", uniqueConstraints = @UniqueConstraint(columnNames = "name"))
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
@Builder
public class CustomerEntity {
    @Id
    @GeneratedValue(generator = "UUID")
    @Column
    private UUID uid;

    @Column(nullable = false, columnDefinition = "NVARCHAR(50)")
    private String username;

    @Column(nullable = false, columnDefinition = "NVARCHAR(200)")
    private String password;

    @Column(name = "first_name", nullable = false, columnDefinition = "NVARCHAR(50)")
    private String firstName;

    @Column(name = "last_name", nullable = false, columnDefinition = "NVARCHAR(50)")
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GenderEnum gender;

    @Column(name = "birth_day", nullable = true)
    private Date birthDay;

    @Column(nullable = false, columnDefinition = "NVARCHAR(200)")
    private String address;

    @Column(name = "phone_number", nullable = false, columnDefinition = "NVARCHAR(12)")
    private String phoneNumber;

    @Column(nullable = false, columnDefinition = "NVARCHAR(200)")
    private String email;

    @Column(name = "photo_url")
    private String photoUrl;

    @OneToMany(mappedBy = "customer")
    @Builder.Default
    private List<OrderEntity> orders = new LinkedList<>();

    @ManyToMany
    @JoinTable(name = "customer_carts", joinColumns = @JoinColumn(name = "customer_uid"), inverseJoinColumns = @JoinColumn(name = "product_uid"))
    @Builder.Default
    private List<ProductEntity> products = new LinkedList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AccountStatusEnum status = AccountStatusEnum.ACTIVE;
}
