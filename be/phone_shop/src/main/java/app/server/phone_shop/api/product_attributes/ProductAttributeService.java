package app.server.phone_shop.api.product_attributes;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import app.server.phone_shop.api.product_attribute_items.ProductAttributeItemEntity;
import app.server.phone_shop.api.product_attributes.dto.AttributeDTO;
import app.server.phone_shop.api.product_attributes.dto.AttributeGroupDTO;
import app.server.phone_shop.api.product_attributes.dto.AttributeIValueItemDTO;
import app.server.phone_shop.api.product_attributes.dto.AttributeNameByGroupDTO;
import app.server.phone_shop.api.product_attributes.dto.CompareProductDTO;
import app.server.phone_shop.api.product_photos.ProductPhotoDto;
import app.server.phone_shop.api.product_photos.ProductPhotoService;
import app.server.phone_shop.api.products.ProductEntity;
import app.server.phone_shop.api.products.ProductService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductAttributeService {

    private final ProductAttributeRepository repository;
    private final ProductAttributeMapper mapper;

    private final ProductService productService;
    private final ProductPhotoService productPhotoService;

    public ProductAttributeDto create(UUID productUid, String name, List<String> items, String groupName) {
        ProductEntity product = productService.getEntityByUid(productUid);
        ProductAttributeEntity entity = ProductAttributeEntity.builder()
                .product(product)
                .name(name)
                .groupName(groupName)
                .build();

        List<ProductAttributeItemEntity> attributeItems = new LinkedList<>();

        for (String item : items) {
            if (!item.trim().isBlank()) {
                attributeItems.add(ProductAttributeItemEntity.builder()
                        .attribute(entity)
                        .value(item)
                        .build());
            }
        }

        entity.setItems(attributeItems);

        return mapper.toDto(repository.save(entity));
    }

    public ProductAttributeDto getByUid(UUID uid) {
        ProductAttributeEntity entity = getEntityByUid(uid);
        return mapper.toDto(entity);
    }

    private ProductAttributeEntity getEntityByUid(UUID uid) {
        ProductAttributeEntity entity = repository.findById(uid).orElseThrow(() -> new EntityNotFoundException());
        return entity;
    }

    public Page<ProductAttributeDto> getAll(UUID productUid, Integer page,
            Integer size,
            String sort, String search) {
        String[] sortParts = (sort != null) ? sort.split(",") : new String[] { "id" };
        String sortBy = sortParts[0];
        Sort.Direction direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("desc"))
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        Sort sortObj = Sort.by(direction, sortBy);

        Specification<ProductAttributeEntity> spec = Specification.where(null);
        spec = spec.and(ProductAttributeSpecification.hasProductUid(productUid));
        spec = spec.and(ProductAttributeSpecification.search(search));

        // Nếu page hoặc size null -> không phân trang, trả toàn bộ danh sách
        if (page == null || size == null) {
            List<ProductAttributeDto> result = repository.findAll(spec, sortObj)
                    .stream()
                    .map(mapper::toDto)
                    .toList();
            return new PageImpl<>(result); // Chuyển về Page để giữ kiểu trả về
        }

        // Có phân trang
        page = Math.max(page, 0);
        size = Math.max(size, 1);
        Pageable pageable = PageRequest.of(page, size, sortObj);

        Page<ProductAttributeEntity> attributePage = repository.findAll(spec, pageable);
        return attributePage.map(mapper::toDto);
    }

    public ProductAttributeDto updateName(UUID uid, String name) {
        ProductAttributeEntity attribute = getEntityByUid(uid);
        attribute.setName(name);
        return mapper.toDto(repository.save(attribute));
    }

    public ProductAttributeDto updateGroup(UUID uid, String group) {
        ProductAttributeEntity attribute = getEntityByUid(uid);
        attribute.setGroupName(group);
        return mapper.toDto(repository.save(attribute));
    }

    public ProductAttributeDto deleteByUid(UUID uid) {
        ProductAttributeEntity attribute = getEntityByUid(uid);
        repository.delete(attribute);
        return mapper.toDto(attribute);
    }

    public boolean checkNameExists(UUID productUid, String name) {
        ProductAttributeEntity attribute = repository.findByNameAndProductUid(name, productUid).orElse(null);
        return attribute != null;
    }

    public List<String> getGroupNames(UUID productUid) {
        Specification<ProductAttributeEntity> spec = Specification.where(null);
        spec = spec.and(ProductAttributeSpecification.hasProductUid(productUid));
        List<ProductAttributeEntity> result = repository.findAll(spec);

        return result.stream()
                .map(ProductAttributeEntity::getGroupName)
                .filter(Objects::nonNull)
                .distinct()
                .sorted()
                .toList();
    }

    // ========================================================================================Toan
    // them moi

    public List<AttributeNameByGroupDTO> getAttributesByProducts(List<UUID> productUids) {
        List<ProductAttributeEntity> attributes = repository.findAllByProductUidIn(productUids);

        Map<String, Set<String>> grouped = new LinkedHashMap<>();

        for (ProductAttributeEntity attr : attributes) {
            String groupName = Optional.ofNullable(attr.getGroupName()).orElse("Khác");
            String attrName = attr.getName();

            grouped
                    .computeIfAbsent(groupName, k -> new LinkedHashSet<>())
                    .add(attrName);
        }

        List<AttributeNameByGroupDTO> result = grouped.entrySet().stream()
                .map(entry -> new AttributeNameByGroupDTO(entry.getKey(), new ArrayList<>(entry.getValue())))
                .toList();

        return result;
    }

    public List<AttributeGroupDTO> getAttributesByProductsForCompareProduct(List<UUID> productUids) {
        List<ProductAttributeEntity> attributes = repository.findAllByProductUidIn(productUids);

        Map<String, Set<AttributeDTO>> grouped = new LinkedHashMap<>();

        for (ProductAttributeEntity attr : attributes) {
            String groupName = Optional.ofNullable(attr.getGroupName()).orElse("Khác");

            // lấy data create AttributeDTO
            String attributeName = attr.getName();
            List<AttributeIValueItemDTO> items = null;

            AttributeDTO attrDTO = new AttributeDTO(attributeName, items);

            grouped
                    .computeIfAbsent(groupName, k -> new LinkedHashSet<>())
                    .add(attrDTO);
        }

        List<AttributeGroupDTO> result = grouped.entrySet().stream()
                .map(entry -> new AttributeGroupDTO(entry.getKey(), new ArrayList<>(entry.getValue())))
                .toList();

        return result;
    }

    public List<CompareProductDTO> compareProducts(List<UUID> productUids) {
        // Kiểm tra xem có sản phẩm nào không
        if (productUids.size() < 1) {
            return null;
        } else {
            // lấy danh sách các AttributeGroupDTO cần hiển thị

            List<AttributeGroupDTO> attributeGroups = getAttributesByProductsForCompareProduct(productUids);
            if (attributeGroups.isEmpty()) {
                // Nếu không có attributeGroups thì trả về danh sách rỗng
                System.out.println("Không có thuộc tính nào để so sánh giữa các sản phẩm.");

            }

            // Bước 2: lấy thông tin tất cả sản phẩm (name, uid)
            List<ProductEntity> products = productService.getAllById(productUids);
            // Bước 3: tạo CompareProductDTO cho từng sản phẩm
            List<CompareProductDTO> compareProducts = new ArrayList<>();
            for (ProductEntity product : products) {
                CompareProductDTO compareProduct = new CompareProductDTO();
                compareProduct.setUid(product.getUid());
                compareProduct.setName(product.getName());
                compareProduct.setPrice(product.getPrice());
                compareProduct.setStar(product.getStar());
                compareProduct.setSoldQuantity(product.getSoldQuantity());
                ProductPhotoDto productPhoto = productPhotoService.getProductAvatar(product.getUid());
                if (productPhoto == null) {
                    compareProduct.setPhotoUrl(null); // Nếu không có ảnh đại diện, gán là null
                } else {
                    compareProduct.setPhotoUrl(productPhoto.getPhotoUrl());

                }
                // Bước 4: gán attributeGroups cho CompareProductDTO
                // đã lấy từ bước 1.
                // gán attributeGroups cho CompareProductDTO
                // nếu không có attributeGroups thì gán rỗng
                List<AttributeGroupDTO> productAttributeGroups = attributeGroups.stream().map(
                        original -> new AttributeGroupDTO(original)).collect(Collectors.toList());
                // Set lại giá trị tương ứng với từng sản phẩm.
                List<ProductAttributeEntity> productAttributes = repository.findAllByProduct_Uid(product.getUid());
                for (ProductAttributeEntity attribute : productAttributes) {
                    String groupName = Optional.ofNullable(attribute.getGroupName()).orElse("Khác");
                    String attributeName = attribute.getName();

                    // Tìm kiếm trong danh sách attributeGroups để cập nhật giá trị
                    boolean isFoundAttribute = false;
                    for (AttributeGroupDTO group : productAttributeGroups) {
                        if (isFoundAttribute) {
                            break;
                        }
                        if (group.getGroupName().equals(groupName)) {////////// PHẢI KIỂM TRA LẠI TRƯỜNG HỢP GROUP NAME
                                                                     ////////// LÀ
                                                                     ////////// KHÁC
                            for (AttributeDTO attr : group.getAttributes()) {

                                if (attr.getName().equals(attributeName)) {

                                    List<AttributeIValueItemDTO> items = attribute.getItems().stream()
                                            .map(item -> new AttributeIValueItemDTO(item.getValue()))
                                            .collect(Collectors.toList());
                                    attr.setValues(items);
                                    isFoundAttribute = true;
                                    break;
                                }
                            }

                        }
                    }
                }
                // gán attributeGroups cho CompareProductDTO
                compareProduct.setAttributeGroups(productAttributeGroups);
                compareProducts.add(compareProduct);
            }
            return compareProducts;
        }

    }

}
