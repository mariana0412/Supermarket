package com.supermarket.repository.EntityRepositories;

import com.supermarket.model.Category;
import com.supermarket.repository.CrudRepository;
import java.util.List;

public interface CategoryRepository extends CrudRepository<Category, Integer> {
    List<Category> findAllSortedByName();
    int getMaxId();
}
