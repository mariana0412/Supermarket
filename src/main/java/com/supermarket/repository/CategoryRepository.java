package com.supermarket.repository;

import com.supermarket.model.Category;

import java.util.List;

public interface CategoryRepository {

    /** insert info about new category */
    int save(Category category);

    /** update info about existing category */
    int update(Category category);

    /** find the category by their ID */
    Category findById(int id);

    /** delete the category by their ID */
    int deleteById(int id);

    /** get list of all the categories */
    List<Category> findAll();

    /** get list of all the categories, sorted by name */
    List<Category> findAllSorted();
}
