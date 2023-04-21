package com.supermarket.repository.EntityRepositories;

import com.supermarket.model.Product;
import com.supermarket.repository.CrudRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ProductRepository extends CrudRepository<Product, Integer> {
    List<Product> findByName(String name);
    List<Product> findAllSortedByName();
    List<Product> findAllFromOneCategorySortedByName(int categoryId);
    int findNumberOfProductsSoldInTimeRange(int productId, LocalDateTime startDate, LocalDateTime endDate);
    int getMaxId();
}
