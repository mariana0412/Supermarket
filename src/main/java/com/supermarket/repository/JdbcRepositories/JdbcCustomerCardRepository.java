package com.supermarket.repository.JdbcRepositories;

import com.supermarket.model.CustomerCard;
import com.supermarket.repository.EntityRepositories.CustomerCardRepository;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;

@Repository
public class JdbcCustomerCardRepository implements CustomerCardRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void save(CustomerCard customerCard) {
        jdbcTemplate.update("INSERT INTO customer_card (card_number, cust_surname, cust_name, cust_patronymic, " +
                        "phone_number, city, street, zip_code, percent) VALUES(?,?,?,?,?,?,?,?,?)",
                customerCard.getCard_number(), customerCard.getCust_surname(), customerCard.getCust_name(),
                customerCard.getCust_patronymic(), customerCard.getPhone_number(), customerCard.getCity(),
                customerCard.getStreet(), customerCard.getZip_code(), customerCard.getPercent());
    }

    @Override
    public void update(CustomerCard customerCard) {
        jdbcTemplate.update("UPDATE customer_card SET cust_surname=?, cust_name=?, cust_patronymic=?, " +
                        "phone_number=?, city=?, street=?, zip_code=?, percent=? WHERE card_number=?",
                customerCard.getCust_surname(), customerCard.getCust_name(), customerCard.getCust_patronymic(),
                customerCard.getPhone_number(), customerCard.getCity(), customerCard.getStreet(),
                customerCard.getZip_code(), customerCard.getPercent(), customerCard.getCard_number());
    }

    @Override
    public CustomerCard findById(String id) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM customer_card WHERE card_number=?",
                    BeanPropertyRowMapper.newInstance(CustomerCard.class), id);
        } catch (IncorrectResultSizeDataAccessException e) {
            return null;
        }
    }

    @Override
    public void deleteById(String id) {
        jdbcTemplate.update("DELETE FROM customer_card WHERE card_number=?", id);
    }

    @Override
    public List<CustomerCard> findAll() {
        return jdbcTemplate.query("SELECT * FROM customer_card",
                BeanPropertyRowMapper.newInstance(CustomerCard.class));
    }

    // M7. Get information about all regular customers, sorted by surname
    @Override
    public List<CustomerCard> findAllSortedBySurname() {
        return jdbcTemplate.query("SELECT * FROM customer_card ORDER BY cust_surname",
                BeanPropertyRowMapper.newInstance(CustomerCard.class));
    }

    // M12. Get information about all regular customers with certain percent of sale, sorted by surname
    @Override
    public List<CustomerCard> findAllWithCertainSaleSortedBySurname(double salePercent) {
        return jdbcTemplate.query("SELECT * FROM customer_card WHERE percent=? ORDER BY cust_surname",
                BeanPropertyRowMapper.newInstance(CustomerCard.class), salePercent);
    }

    // C6. Find customers by surname
    @Override
    public List<CustomerCard> findBySurname(String surname) {
        try {
            return jdbcTemplate.query("SELECT * FROM customer_card WHERE cust_surname=?",
                    BeanPropertyRowMapper.newInstance(CustomerCard.class), surname);
        } catch (IncorrectResultSizeDataAccessException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public List<CustomerCard> findCustomersWhoBoughtFromEachCategory() {
        String query = "" +
                "SELECT * " +
                "FROM customer_card " +
                "WHERE NOT EXISTS ( " +
                "        SELECT * " +
                "        FROM category " +
                "        WHERE NOT EXISTS ( " +
                "               SELECT * " +
                "               FROM store_product " +
                "               INNER JOIN product ON store_product.id_product = product.id_product " +
                "               INNER JOIN sale ON store_product.UPC = sale.UPC " +
                "               INNER JOIN receipt ON sale.check_number = receipt.check_number " +
                "               WHERE receipt.card_number = customer_card.card_number " +
                "               AND product.category_number = category.category_number " +
                "               ) " +
                "       )";
        return jdbcTemplate.query(query, BeanPropertyRowMapper.newInstance(CustomerCard.class));
    }
}
