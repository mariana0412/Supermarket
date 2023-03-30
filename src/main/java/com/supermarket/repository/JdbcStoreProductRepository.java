package com.supermarket.repository;

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
    public int save(StoreProduct storeProduct) {
        return jdbcTemplate.update("INSERT INTO store_product (UPC, UPC_prom, id_product, selling_price, " +
                        "products_number, promotional_product) VALUES(?,?,?,?,?,?)",
                storeProduct.getUPC(), storeProduct.getUPC_prom(), storeProduct.getId_product(),
                storeProduct.getSelling_price(), storeProduct.getProducts_number(), storeProduct.isPromotional_product());
    }

    @Override
    public int update(StoreProduct storeProduct) {
        return jdbcTemplate.update("UPDATE store_product SET UPC_prom=?, id_product=?, selling_price=?, " +
                        "products_number=?, promotional_product=? WHERE UPC=?",
                storeProduct.getUPC_prom(), storeProduct.getId_product(), storeProduct.getSelling_price(),
                storeProduct.getProducts_number(), storeProduct.isPromotional_product(), storeProduct.getUPC());
    }

    @Override
    public StoreProduct findById(String id) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM store_product WHERE UPC=:ID",
                    BeanPropertyRowMapper.newInstance(StoreProduct.class), id);
        } catch (IncorrectResultSizeDataAccessException e) {
            return null;
        }
    }

    @Override
    public int deleteById(String id) {
        return jdbcTemplate.update("DELETE FROM store_product WHERE UPC=?", id);
    }

    @Override
    public List<StoreProduct> findAll() {
        return jdbcTemplate.query("SELECT * FROM store_product", BeanPropertyRowMapper.newInstance(StoreProduct.class));
    }

    // 10. Get information about all store products, sorted by number
    @Override
    public List<StoreProduct> findAllSortedByNum() {
        return jdbcTemplate.query("SELECT * FROM store_product ORDER BY products_number",
                BeanPropertyRowMapper.newInstance(StoreProduct.class));
    }

    // 14. Get selling price, products number, product name and characteristics by UPC
    @Override
    public StoreProduct.StoreProductDetails findDetailsByUPC(String UPC) {
        StringBuilder query = new StringBuilder();
        query
                .append("SELECT upc, selling_price, products_number, product_name, characteristics ")
                .append("FROM store_product ")
                .append("INNER JOIN product ON store_product.id_product=product.id_product ")
                .append("WHERE UPC=?");
        return jdbcTemplate.queryForObject(query.toString(),
                BeanPropertyRowMapper.newInstance(StoreProduct.StoreProductDetails.class), UPC);
    }

    // 15. Get information about all promotional store products, sorted by number
    @Override
    public List<StoreProduct> findAllPromSortedByNum() {
        return jdbcTemplate.query("SELECT * FROM store_product WHERE promotional_product=true ORDER BY products_number",
                BeanPropertyRowMapper.newInstance(StoreProduct.class));
    }

    // 15. Get information about all promotional store products, sorted by name
    @Override
    public List<StoreProduct> findAllPromSortedByName() {
        return jdbcTemplate.query("SELECT * " +
                        "FROM store_product INNER JOIN product ON store_product.id_product = product.id_product " +
                        "WHERE promotional_product=true ORDER BY product_name",
                BeanPropertyRowMapper.newInstance(StoreProduct.class));
    }

    // 16. Get information about all not promotional store products, sorted by number
    @Override
    public List<StoreProduct> findAllNotPromSortedByNum() {
        return jdbcTemplate.query("SELECT * FROM store_product WHERE promotional_product=false ORDER BY products_number",
                BeanPropertyRowMapper.newInstance(StoreProduct.class));
    }

    // 16. Get information about all not promotional store products, sorted by name
    @Override
    public List<StoreProduct> findAllNotPromSortedByName() {
        return jdbcTemplate.query("SELECT * " +
                        "FROM store_product INNER JOIN product ON store_product.id_product = product.id_product " +
                        "WHERE promotional_product=false ORDER BY product_name",
                BeanPropertyRowMapper.newInstance(StoreProduct.class));
    }
}
