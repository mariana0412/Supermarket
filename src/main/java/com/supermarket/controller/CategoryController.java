package com.supermarket.controller;

import com.supermarket.model.Category;
import com.supermarket.repository.EntityRepositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api")
public class CategoryController {
    @Autowired
    CategoryRepository categoryRepository;

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories(@RequestParam(required = false) boolean sorted) {
        List<Category> categories;
        try {
            if(sorted)
                categories = new ArrayList<>(categoryRepository.findAllSortedByName());
            else
                categories = new ArrayList<>(categoryRepository.findAll());

            if (categories.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            return new ResponseEntity<>(categories, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable("id") int id) {
        Category category = categoryRepository.findById(id);

        if (category != null)
            return new ResponseEntity<>(category, HttpStatus.OK);

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/categories")
    public ResponseEntity<String> createCategory(@RequestBody Category category) {
        int id = categoryRepository.getMaxId() + 1;
        try {
            categoryRepository.save(new Category(id, category.getCategory_name()));
            return new ResponseEntity<>("Category was created successfully.", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<String> updateCategory(@PathVariable("id") int id, @RequestBody Category category) {
        Category _category = categoryRepository.findById(id);

        if (_category != null) {
            _category.setCategory_number(id);
            _category.setCategory_name(category.getCategory_name());
            categoryRepository.update(_category);
            return new ResponseEntity<>("Category was updated successfully.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Cannot find Category with id=" + id, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Map<String, Object>> deleteCategory(@PathVariable("id") int id) {
        try {
            categoryRepository.deleteById(id);
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Category was deleted successfully."
            ));
        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "status", "error",
                            "message", "Cannot delete category because it has associated products."
                    ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "An error occurred while deleting the category."
                    ));
        }
    }

}
