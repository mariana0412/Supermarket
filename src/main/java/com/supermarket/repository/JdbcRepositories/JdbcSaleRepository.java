package com.supermarket.repository.JdbcRepositories;

import com.supermarket.model.Sale;
import com.supermarket.repository.EntityRepositories.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcSaleRepository implements SaleRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void save(Sale sale) {
        jdbcTemplate.update("INSERT INTO sale (UPC, check_number, product_number, selling_price) VALUES(?,?,?,?)",
                sale.getUPC(), sale.getCheck_number(), sale.getProduct_number(), sale.getSelling_price());
    }

}
