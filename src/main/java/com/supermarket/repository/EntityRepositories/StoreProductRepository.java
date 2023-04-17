package com.supermarket.repository.EntityRepositories;

import com.supermarket.model.StoreProduct;
import com.supermarket.repository.CrudRepository;

import java.util.List;

public interface StoreProductRepository extends CrudRepository<StoreProduct, String> {
    // get selling price, products number, product name and characteristics
    StoreProduct.StoreProductDetails findDetailsByUPC(String UPC);
    List<StoreProduct> findAllSortedByNumber();
    List<StoreProduct> findAllSortedByName();
    List<StoreProduct> findAllPromotionalSortedByNumber();
    List<StoreProduct> findAllPromotionalSortedByName();
    List<StoreProduct> findAllNotPromotionalSortedByNumber();
    List<StoreProduct> findAllNotPromotionalSortedByName();
}