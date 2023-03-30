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
    List<StoreProduct> findAllSortedByNum();

    /** get list of all promotional store products, sorted by number */
    List<StoreProduct> findAllPromSortedByNum();

    /** get list of all promotional store products, sorted by name */
    List<StoreProduct> findAllPromSortedByName();

    /** get list of all not promotional store products, sorted by number */
    List<StoreProduct> findAllNotPromSortedByNum();

    /** get list of all not promotional store products, sorted by name */
    List<StoreProduct> findAllNotPromSortedByName();
}
