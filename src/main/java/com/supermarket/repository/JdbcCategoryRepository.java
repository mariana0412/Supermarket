package com.supermarket.repository;

import com.supermarket.model.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class JdbcCategoryRepository implements CategoryRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public int save(Category category) {
        return jdbcTemplate.update("INSERT INTO category (category_number, category_name) VALUES(?,?)",
                category.getCategory_number(), category.getCategory_name());
    }

    @Override
    public int update(Category category) {
        return jdbcTemplate.update("UPDATE category SET category_name=? WHERE category_number=?",
                category.getCategory_name(), category.getCategory_number());
    }

    @Override
    public Category findById(int id) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM category WHERE category_number=?",
                    BeanPropertyRowMapper.newInstance(Category.class), id);
        } catch (IncorrectResultSizeDataAccessException e) {
            return null;
        }
    }

    @Override
    public int deleteById(int id) {
        return jdbcTemplate.update("DELETE FROM category WHERE category_number=?", id);
    }

    @Override
    public List<Category> findAll() {
        return jdbcTemplate.query("SELECT * from category", BeanPropertyRowMapper.newInstance(Category.class));
    }

    // 8. Get information about all categories, sorted by name
    @Override
    public List<Category> findAllSorted() {
        return jdbcTemplate.query("SELECT * from category ORDER BY category_name",
                BeanPropertyRowMapper.newInstance(Category.class));
    }
}
