package be_smart_job.service.job.interfaces;

import be_smart_job.dto.req.job.CategoryRequest;
import be_smart_job.dto.res.job.CategoryResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getAllCategories();
    CategoryResponse getCategoryById(String id);
    CategoryResponse createCategory(CategoryRequest request);
    CategoryResponse updateCategory(String id, CategoryRequest request);
    void deleteCategory(String id);
}
