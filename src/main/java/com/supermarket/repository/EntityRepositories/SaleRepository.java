package com.supermarket.repository.EntityRepositories;

import com.supermarket.model.Sale;

import java.util.List;

public interface SaleRepository {
    void save(Sale sale);
    List<Sale.ProductNameNumberPrice> findPurchasedProductsInCheck(String checkNumber);
}
