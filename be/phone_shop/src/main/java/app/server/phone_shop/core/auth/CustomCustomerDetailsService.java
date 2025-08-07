package app.server.phone_shop.core.auth;

import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import app.server.phone_shop.api.customers.CustomerEntity;
import app.server.phone_shop.api.customers.CustomerRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomCustomerDetailsService implements UserDetailsService {

        private final CustomerRepository customerRepository;

        @Override
        public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                UUID uid = UUID.fromString(username);

                CustomerEntity customerEntity = customerRepository.findById(uid)
                                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy khách hàng"));

                UUID accountUid = customerEntity.getUid();
                UUID userUid = customerEntity.getUid();

                List<GrantedAuthority> authorities = new LinkedList<>();

                return new CustomUserDetails(AuthType.CUSTOMER, accountUid, userUid, authorities);
        }

}
