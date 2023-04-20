package com.supermarket.repository.JdbcRepositories;

import com.supermarket.model.Sale;
import com.supermarket.repository.EntityRepositories.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class JdbcSaleRepository implements SaleRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void save(Sale sale) {
        jdbcTemplate.update("INSERT INTO sale (UPC, check_number, product_number, selling_price) VALUES(?,?,?,?)",
                sale.getUPC(), sale.getCheck_number(), sale.getProduct_number(), sale.getSelling_price());
    }

    // 17-18. Possibility of viewing the purchased goods in the check: their names, quantities and prices
    @Override
    public List<Sale.ProductNameNumberPrice> findPurchasedProductsInCheck(String checkNumber) {
        String query =
                "SELECT product.product_name, sale.product_number, sale.selling_price " +
                "FROM receipt " +
                "JOIN sale ON sale.check_number = receipt.check_number " +
                "JOIN store_product ON store_product.UPC = sale.UPC " +
                "JOIN product ON product.id_product = store_product.id_product " +
                "WHERE receipt.check_number=?";
        return jdbcTemplate.query(query,
                BeanPropertyRowMapper.newInstance(Sale.ProductNameNumberPrice.class), checkNumber);
    }

}
