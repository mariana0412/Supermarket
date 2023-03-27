package com.supermarket.repository;

import com.supermarket.model.Product;

import java.util.List;

public interface ProductRepository {
    /** insert info about new product */
    int save(Product product);

    /** update info about existing product */
    int update(Product product);

    /** find the product by their ID */
    Product findById(int id);

    /** delete the product by their ID */
    int deleteById(int id);

    /** get list of all the products */
    List<Product> findAll();
}
