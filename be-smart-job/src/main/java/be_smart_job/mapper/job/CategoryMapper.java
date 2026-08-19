package be_smart_job.mapper.job; // Hoặc package be_smart_job.mapper.category tùy thư mục của bạn

import be_smart_job.dto.req.job.CategoryRequest;
import be_smart_job.dto.res.job.CategoryResponse;
import be_smart_job.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryResponse toResponse(Category category);
    Category toEntity(CategoryRequest request);
    void updateEntityFromRequest(CategoryRequest request, @MappingTarget Category category);

    // Chuyển đổi Instant -> LocalDateTime
    default LocalDateTime map(Instant instant) {
        return instant == null ? null : LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
    }

    // Chuyển đổi LocalDateTime -> Instant
    default Instant map(LocalDateTime localDateTime) {
        return localDateTime == null ? null : localDateTime.atZone(ZoneId.systemDefault()).toInstant();
    }
}