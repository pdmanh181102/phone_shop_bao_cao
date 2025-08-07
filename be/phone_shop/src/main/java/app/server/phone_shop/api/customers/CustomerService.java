package app.server.phone_shop.api.customers;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import app.server.phone_shop.api.account_status.AccountStatusEnum;
import app.server.phone_shop.api.accounts.AccountEntity;
import app.server.phone_shop.api.customers.request_dto.CreateCustomerRequest;
import app.server.phone_shop.api.customers.request_dto.UpdatePasswordResponse;
import app.server.phone_shop.api.orders.OrderDto;
import app.server.phone_shop.api.orders.OrderMapper;
import app.server.phone_shop.api.user_genders.GenderEnum;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository repository;
    private final CustomerMapper mapper;
    private final OrderMapper orderMapper;
    private final PasswordEncoder passwordEncoder;

    public CustomerDto createCustomer(CreateCustomerRequest dto) {

        if (repository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username đã tồn tại");
        }

        CustomerEntity customerEntity = CustomerEntity.builder()
                .username(dto.getUsername())
                .password(passwordEncoder.encode(dto.getPassword()))
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .gender(dto.getGender())
                .birthDay(dto.getBirthDay())
                .address(dto.getAddress())
                .phoneNumber(dto.getPhoneNumber())
                .email(dto.getEmail())
                .status(AccountStatusEnum.DISABLE)
                .build();

        CustomerEntity saved = repository.save(customerEntity);

        return mapper.toDto(saved);
    }

    public CustomerDto login(String username, String password) {
        CustomerEntity customer = getEntityByUsername(username);

        if (!passwordEncoder.matches(password, customer.getPassword())) {
            throw new RuntimeException("Sai mật khẩu");
        }

        return mapper.toDto(customer);
    }

    private CustomerEntity getEntityByUsername(String username) {
        return repository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Tên đăng nhập không tồn tại"));
    }

    public CustomerEntity getEntityByUid(UUID uid) {
        return repository.findById(uid)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy customer với UID: " + uid.toString()));
    }

    public CustomerDto getByUid(UUID uid) {
        CustomerEntity entity = getEntityByUid(uid);
        return mapper.toDto(entity);
    }

    public List<OrderDto> getOrders(UUID uid) {
        CustomerEntity customerEntity = getEntityByUid(uid);
        if (customerEntity.getOrders() == null) {
            return Collections.emptyList();
        }
        return customerEntity.getOrders().stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());
    }

    public CustomerDto verifyByEmail(String email) {
        CustomerEntity customerEntity = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("email chưa được đăng kí!"));
        return mapper.toDto(customerEntity);
    }

    public boolean checkUsernameExists(String username) {
        CustomerEntity entity = repository.findByUsername(username).orElse(null);
        return entity != null;
    }

    public boolean checkEmailExists(String email) {
        CustomerEntity entity = repository.findByEmail(email).orElse(null);
        return entity != null;
    }

    public UpdatePasswordResponse updatePasswordByEmail(String email, String newPassword) {
        CustomerEntity customerEntity = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại!"));
        customerEntity.setPassword(passwordEncoder.encode(newPassword));
        repository.save(customerEntity);
        return new UpdatePasswordResponse(true, "Password updated successfully.");
    }

    public CustomerDto updatePhotoUrl(UUID uid, String url) {
        CustomerEntity customerEntity = getEntityByUid(uid);
        customerEntity.setPhotoUrl(url);
        return mapper.toDto(repository.save(customerEntity));
    }

    public CustomerDto updateFirstName(UUID uid, String firstName) {
        CustomerEntity customerEntity = getEntityByUid(uid);
        customerEntity.setFirstName(firstName);
        return mapper.toDto(repository.save(customerEntity));
    }

    public CustomerDto updateLastName(UUID uid, String lastName) {
        CustomerEntity customerEntity = getEntityByUid(uid);
        customerEntity.setLastName(lastName);
        return mapper.toDto(repository.save(customerEntity));
    }

    public CustomerDto updateGender(UUID uid, GenderEnum gender) {
        CustomerEntity customerEntity = getEntityByUid(uid);
        customerEntity.setGender(gender);
        return mapper.toDto(repository.save(customerEntity));
    }

    public CustomerDto updateAddress(UUID uid, String address) {
        CustomerEntity customerEntity = getEntityByUid(uid);
        customerEntity.setAddress(address);
        return mapper.toDto(repository.save(customerEntity));
    }

    public CustomerDto updatePhoneNumber(UUID uid, String phoneNumber) {
        CustomerEntity customerEntity = getEntityByUid(uid);
        customerEntity.setPhoneNumber(phoneNumber);
        return mapper.toDto(repository.save(customerEntity));
    }

    public CustomerDto updatePassword(UUID uid, String oldPassword, String password) {
        CustomerEntity entity = getEntityByUid(uid);
        if (!passwordEncoder.matches(oldPassword, entity.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không đúng");
        }
        entity.setPassword(passwordEncoder.encode(password));
        return mapper.toDto(repository.save(entity));
    }
}
