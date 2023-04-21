package com.supermarket.repository.JdbcRepositories;

import com.supermarket.repository.EntityRepositories.StoreProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.supermarket.model.StoreProduct;

import java.util.List;

@Repository
public class JdbcStoreProductRepository implements StoreProductRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void save(StoreProduct storeProduct) {
        jdbcTemplate.update("INSERT INTO store_product (UPC, UPC_prom, id_product, selling_price, " +
                        "products_number, promotional_product) VALUES(?,?,?,?,?,?)",
                storeProduct.getUPC(), storeProduct.getUPC_prom(), storeProduct.getId_product(),
                storeProduct.getSelling_price(), storeProduct.getProducts_number(),
                storeProduct.isPromotional_product());
    }

    @Override
    public void update(StoreProduct storeProduct) {
        jdbcTemplate.update("UPDATE store_product SET UPC_prom=?, id_product=?, selling_price=?, " +
                        "products_number=?, promotional_product=? WHERE UPC=?",
                storeProduct.getUPC_prom(), storeProduct.getId_product(), storeProduct.getSelling_price(),
                storeProduct.getProducts_number(), storeProduct.isPromotional_product(), storeProduct.getUPC());
    }

    @Override
    public StoreProduct findById(String id) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM store_product WHERE UPC=?",
                    BeanPropertyRowMapper.newInstance(StoreProduct.class), id);
        } catch (IncorrectResultSizeDataAccessException e) {
            return null;
        }
    }

    @Override
    public void deleteById(String id) {
        jdbcTemplate.update("DELETE FROM store_product WHERE UPC=?", id);
    }

    @Override
    public List<StoreProduct> findAll() {
        return jdbcTemplate.query("SELECT * FROM store_product", BeanPropertyRowMapper.newInstance(StoreProduct.class));
    }

    // 10. Get information about all store products, sorted by number
    @Override
    public List<StoreProduct> findAllSortedByNumber() {
        return jdbcTemplate.query("SELECT * FROM store_product ORDER BY products_number",
                BeanPropertyRowMapper.newInstance(StoreProduct.class));
    }

    // 2. Get information about all store products, sorted by name
    @Override
    public List<StoreProduct> findAllSortedByName() {
        return jdbcTemplate.query("SELECT * FROM store_product ORDER BY product_name",
                BeanPropertyRowMapper.newInstance(StoreProduct.class));
    }

    // 14. Get selling price, products number, product name and characteristics by UPC
    @Override
    public StoreProduct.StoreProductDetails findDetailsByUPC(String UPC) {
        String query =
                "SELECT upc, selling_price, products_number, product_name, characteristics " +
                "FROM store_product " +
                "INNER JOIN product ON store_product.id_product=product.id_product " +
                "WHERE UPC=?";
        try {
            return jdbcTemplate.queryForObject(query,
                    BeanPropertyRowMapper.newInstance(StoreProduct.StoreProductDetails.class), UPC);
        } catch (IncorrectResultSizeDataAccessException e) {
                return null;
        }
    }

    // 15. Get information about all promotional store products, sorted by number
    @Override
    public List<StoreProduct> findAllPromotionalSortedByNumber() {
        String query =
                "SELECT * " +
                "FROM store_product " +
                "WHERE promotional_product=true " +
                "ORDER BY products_number";
        return jdbcTemplate.query(query, BeanPropertyRowMapper.newInstance(StoreProduct.class));
    }

    // 15. Get information about all promotional store products, sorted by name
    @Override
    public List<StoreProduct> findAllPromotionalSortedByName() {
        String query =
                "SELECT * " +
                "FROM store_product " +
                "INNER JOIN product ON store_product.id_product = product.id_product " +
                "WHERE promotional_product=true " +
                "ORDER BY product_name";
        return jdbcTemplate.query(query, BeanPropertyRowMapper.newInstance(StoreProduct.class));
    }

    // 16. Get information about all not promotional store products, sorted by number
    @Override
    public List<StoreProduct> findAllNotPromotionalSortedByNumber() {
        String query =
                "SELECT * " +
                "FROM store_product " +
                "WHERE promotional_product=false " +
                "ORDER BY products_number";
        return jdbcTemplate.query(query, BeanPropertyRowMapper.newInstance(StoreProduct.class));
    }

    // 16. Get information about all not promotional store products, sorted by name
    @Override
    public List<StoreProduct> findAllNotPromotionalSortedByName() {
        String query =
                "SELECT * " +
                "FROM store_product " +
                "INNER JOIN product ON store_product.id_product = product.id_product " +
                "WHERE promotional_product=false " +
                "ORDER BY product_name";
        return jdbcTemplate.query(query, BeanPropertyRowMapper.newInstance(StoreProduct.class));
    }

    @Override
    public StoreProduct findPromotional(int productId) {
        String query =
                "SELECT * " +
                "FROM store_product " +
                "WHERE id_product=? AND promotional_product=true";
        try {
            return jdbcTemplate.queryForObject(query, BeanPropertyRowMapper.newInstance(StoreProduct.class), productId);
        } catch (IncorrectResultSizeDataAccessException e) {
            return null;
        }
    }

    @Override
    public StoreProduct findNotPromotional(int productId) {
        String query =
                "SELECT * " +
                        "FROM store_product " +
                        "WHERE id_product=? AND promotional_product=false";
        try {
            return jdbcTemplate.queryForObject(query, BeanPropertyRowMapper.newInstance(StoreProduct.class), productId);
        } catch (IncorrectResultSizeDataAccessException e) {
            return null;
        }
    }
}
