package app.server.phone_shop.api.cart;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import app.server.phone_shop.api.customers.CustomerEntity;
import app.server.phone_shop.api.customers.CustomerRepository;
import app.server.phone_shop.api.customers.CustomerService;
import app.server.phone_shop.api.products.ProductDto;
import app.server.phone_shop.api.products.ProductEntity;
import app.server.phone_shop.api.products.ProductMapper;
import app.server.phone_shop.api.products.ProductService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CustomerRepository customerRepository;
    private final CustomerService customerService;
    private final ProductMapper productMapper;
    private final ProductService productService;

    public List<ProductDto> getAllCartItems(UUID customerUid) {
        CustomerEntity customer = customerService.getEntityByUid(customerUid);
        if (customer.getProducts() == null) {
            return Collections.emptyList();
        }
        return customer.getProducts().stream()
                .map(productMapper::toDto)
                .toList();
    }

    public void addProductToCard(UUID customerUid, UUID productUid) {
        CustomerEntity customerEntity = customerService.getEntityByUid(customerUid);
        ProductEntity productEntity = productService.getEntityByUid(productUid);
        if (!customerEntity.getProducts().contains(productEntity)) {
            customerEntity.getProducts().add(productEntity);
            customerRepository.save(customerEntity);
        }
    }

    public void removeProductToCard(UUID customerUid, UUID productUid) {
        CustomerEntity customerEntity = customerService.getEntityByUid(customerUid);
        ProductEntity productEntity = productService.getEntityByUid(productUid);
        if (customerEntity.getProducts().contains(productEntity)) {
            customerEntity.getProducts().remove(productEntity);
            customerRepository.save(customerEntity);
        }
    }

}
