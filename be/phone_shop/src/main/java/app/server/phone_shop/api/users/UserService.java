package app.server.phone_shop.api.users;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import app.server.phone_shop.api.user_genders.GenderEnum;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final UserMapper mapper;

    public UserDto create(String firstName, String lastName, GenderEnum gender) {
        try {
            UserEntity entity = UserEntity.builder().firstName(firstName).lastName(lastName).gender(gender).build();
            return mapper.toDto(repository.save(entity));
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public UserDto getByUid(UUID uid) {
        UserEntity entity = getEntityByUid(uid);
        return mapper.toDto(entity);
    }

    public UserEntity getEntityByUid(UUID uid) {
        UserEntity entity = repository.findById(uid).orElseThrow(() -> new EntityNotFoundException());
        return entity;
    }

    public Page<UserDto> getAll(Integer page, Integer size, String sort, String search) {
        String[] sortParts = (sort != null) ? sort.split(",") : new String[] { "id" };
        String sortBy = sortParts[0];
        Sort.Direction direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("desc"))
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        Sort sortObj = Sort.by(direction, sortBy);

        Specification<UserEntity> spec = Specification.where(null);
        spec = spec.and(UserSpecification.search(search));

        // Nếu page hoặc size null -> không phân trang, trả toàn bộ danh sách
        if (page == null || size == null) {
            List<UserDto> result = repository.findAll(spec, sortObj)
                    .stream()
                    .map(mapper::toDto)
                    .toList();
            return new PageImpl<>(result); // Chuyển về Page để giữ kiểu trả về
        }

        // Có phân trang
        page = Math.max(page, 0);
        size = Math.max(size, 1);
        Pageable pageable = PageRequest.of(page, size, sortObj);

        Page<UserEntity> brandPage = repository.findAll(spec, pageable);
        return brandPage.map(mapper::toDto);
    }

    public UserDto updatePhotoUrl(UUID uid, String url) {
        UserEntity entity = getEntityByUid(uid);
        entity.setPhotoUrl(url);
        return mapper.toDto(repository.save(entity));
    }

    public UserDto updateFirstName(UUID uid, String firstName) {
        UserEntity entity = getEntityByUid(uid);
        entity.setFirstName(firstName);
        return mapper.toDto(repository.save(entity));
    }

    public UserDto updateLastName(UUID uid, String lastName) {
        UserEntity entity = getEntityByUid(uid);
        entity.setLastName(lastName);
        return mapper.toDto(repository.save(entity));
    }

    public UserDto updateGender(UUID uid, GenderEnum gender) {
        UserEntity entity = getEntityByUid(uid);
        entity.setGender(gender);
        return mapper.toDto(repository.save(entity));
    }

    public UserDto deleteByUid(UUID uid) {
        UserEntity brand = getEntityByUid(uid);
        repository.delete(brand);
        return mapper.toDto(brand);
    }
}
