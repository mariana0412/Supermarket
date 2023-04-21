package com.supermarket.repository.JdbcRepositories;

import com.supermarket.repository.EntityRepositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.supermarket.model.Product;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public class JdbcProductRepository implements ProductRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void save(Product product) {
        jdbcTemplate.update("INSERT INTO product (id_product, category_number, product_name, producer, " +
                        "characteristics) VALUES(?,?,?,?,?)",
                product.getId_product(), product.getCategory_number(), product.getProduct_name(), product.getProducer(),
                product.getCharacteristics());
    }

    @Override
    public void update(Product product) {
        jdbcTemplate.update("UPDATE product SET category_number=?, product_name=?, producer=?, characteristics=? " +
                        "WHERE id_product=?",
                product.getCategory_number(), product.getProduct_name(), product.getProducer(),
                product.getCharacteristics(), product.getId_product());
    }

    @Override
    public Product findById(Integer id) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM product WHERE id_product=?",
                    BeanPropertyRowMapper.newInstance(Product.class), id);
        } catch (IncorrectResultSizeDataAccessException e) {
            return null;
        }
    }

    @Override
    public void deleteById(Integer id) {
        jdbcTemplate.update("DELETE FROM product WHERE id_product=?", id);
    }

    @Override
    public List<Product> findAll() {
        return jdbcTemplate.query("SELECT * FROM product", BeanPropertyRowMapper.newInstance(Product.class));
    }

    @Override
    public List<Product> findByName(String name) {
        return jdbcTemplate.query("SELECT * FROM product WHERE product_name=?",
                BeanPropertyRowMapper.newInstance(Product.class), name);
    }

    // 9. Get information about all products, sorted by name
    @Override
    public List<Product> findAllSortedByName() {
        return jdbcTemplate.query("SELECT * FROM product ORDER BY product_name", BeanPropertyRowMapper.newInstance(Product.class));
    }

    // 13. Get information about all products from one category, sorted by name
    @Override
    public List<Product> findAllFromOneCategorySortedByName(int catId) {
        return jdbcTemplate.query("SELECT * FROM product WHERE category_number=? ORDER BY product_name",
                BeanPropertyRowMapper.newInstance(Product.class), catId);
    }

    // 17. Determine the total number of a certain product sold during a certain period of time
    @Override
    public int findNumberOfProductsSoldInTimeRange(int productId, LocalDateTime startDate, LocalDateTime endDate) {
        String query =
                "SELECT SUM(product_number) " +
                "FROM product " +
                "INNER JOIN store_product ON store_product.id_product = product.id_product " +
                "INNER JOIN sale ON sale.UPC = store_product.UPC " +
                "INNER JOIN receipt ON receipt.check_number = sale.check_number " +
                "WHERE product.id_product=? AND print_date BETWEEN ? AND ?";
        Integer productsNumber = jdbcTemplate.queryForObject(query, Integer.class, productId, startDate, endDate);
        return (productsNumber != null) ? productsNumber : 0;
    }

    @Override
    public int getMaxId() {
        String query = "SELECT MAX(id_product) FROM product";
        Integer maxId = jdbcTemplate.queryForObject(query, Integer.class);
        return (maxId != null) ? maxId : 0;
    }
}
