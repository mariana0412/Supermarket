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
            return jdbcTemplate.queryForObject("SELECT * FROM store_product WHERE UPC=?",
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
}
