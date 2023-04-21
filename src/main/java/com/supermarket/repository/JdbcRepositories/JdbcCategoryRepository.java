package com.supermarket.repository.JdbcRepositories;

import com.supermarket.model.Category;
import com.supermarket.repository.EntityRepositories.CategoryRepository;
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
    public void save(Category category) {
        jdbcTemplate.update("INSERT INTO category (category_number, category_name) VALUES(?,?)",
                category.getCategory_number(), category.getCategory_name());
    }

    @Override
    public void update(Category category) {
        jdbcTemplate.update("UPDATE category SET category_name=? WHERE category_number=?",
                category.getCategory_name(), category.getCategory_number());
    }

    @Override
    public Category findById(Integer id) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM category WHERE category_number=?",
                    BeanPropertyRowMapper.newInstance(Category.class), id);
        } catch (IncorrectResultSizeDataAccessException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public void deleteById(Integer id) {
        jdbcTemplate.update("DELETE FROM category WHERE category_number=?", id);
    }

    @Override
    public List<Category> findAll() {
        return jdbcTemplate.query("SELECT * from category", BeanPropertyRowMapper.newInstance(Category.class));
    }

    // M8. Get information about all categories, sorted by name
    @Override
    public List<Category> findAllSortedByName() {
        return jdbcTemplate.query("SELECT * from category ORDER BY category_name",
                BeanPropertyRowMapper.newInstance(Category.class));
    }

    @Override
    public int getMaxId() {
        String query = "SELECT MAX(category_number) FROM category";
        Integer maxId = jdbcTemplate.queryForObject(query, Integer.class);
        return (maxId != null) ? maxId : 0;

    }
}
