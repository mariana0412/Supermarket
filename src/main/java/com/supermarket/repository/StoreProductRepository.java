package com.supermarket.repository;

import com.supermarket.model.StoreProduct;

import java.util.List;

public interface StoreProductRepository {
    /** insert info about new store product */
    int save(StoreProduct storeProduct);

    /** update info about existing store product */
    int update(StoreProduct product);

    /** find the store product by their ID */
    StoreProduct findById(String id);

    /** delete the store product by their ID */
    int deleteById(String id);

    /** get list of all the store products */
    List<StoreProduct> findAll();

    /** get list of all the store products, sorted by number */
    List<StoreProduct> findAllSorted();
}
