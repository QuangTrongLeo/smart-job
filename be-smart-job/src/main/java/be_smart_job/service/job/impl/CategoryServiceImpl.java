package be_smart_job.service.job.impl;

import be_smart_job.dto.req.job.CategoryRequest;
import be_smart_job.dto.res.job.CategoryResponse;
import be_smart_job.entity.Category;
import be_smart_job.mapper.job.CategoryMapper;
import be_smart_job.repository.job.CategoryRepository;
import be_smart_job.service.job.interfaces.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(categoryMapper::toResponse)
                .toList();
    }

    @Override
    public CategoryResponse getCategoryById(String id) {
        Category category = findById(id);
        return categoryMapper.toResponse(category);
    }

    @Override
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName().trim())) {
            throw new IllegalArgumentException("Tên danh mục đã tồn tại");
        }

        Category category = categoryMapper.toEntity(request);
        category.setName(request.getName().trim());
        Category savedCategory = categoryRepository.save(category);

        return categoryMapper.toResponse(savedCategory);
    }

    @Override
    public CategoryResponse updateCategory(String id, CategoryRequest request) {
        Category category = findById(id);
        String newName = request.getName().trim();

        if (!category.getName().equalsIgnoreCase(newName) && categoryRepository.existsByName(newName)) {
            throw new IllegalArgumentException("Tên danh mục đã tồn tại");
        }

        categoryMapper.updateEntityFromRequest(request, category);
        category.setName(newName);
        Category updatedCategory = categoryRepository.save(category);

        return categoryMapper.toResponse(updatedCategory);
    }

    @Override
    public void deleteCategory(String id) {
        Category category = findById(id);
        categoryRepository.delete(category);
    }

    private Category findById(String id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy danh mục với ID: " + id));
    }
}
