package com.supermarket.repository;

import com.supermarket.model.CustomerCard;
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
    public int save(CustomerCard customerCard) {
        return jdbcTemplate.update("INSERT INTO customer_card (card_number, cust_surname, cust_name, cust_patronymic, " +
                        "phone_number, city, street, zip_code, percent) " +
                        "VALUES(?,?,?,?,?,?,?,?,?)",
                customerCard.getCard_number(), customerCard.getCust_surname(), customerCard.getCust_name(),
                customerCard.getCust_patronymic(), customerCard.getPhone_number(), customerCard.getCity(),
                customerCard.getStreet(), customerCard.getZip_code(), customerCard.getPercent());
    }

    @Override
    public int update(CustomerCard customerCard) {
        return jdbcTemplate.update("UPDATE customer_card SET cust_surname=?, cust_name=?, cust_patronymic=?, phone_number=?, " +
                        "city=?, street=?, zip_code=?, percent=? WHERE card_number=?",
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
    public int deleteById(String id) {
        return jdbcTemplate.update("DELETE FROM customer_card WHERE card_number=?", id);
    }

    @Override
    public List<CustomerCard> findAll() {
        return jdbcTemplate.query("SELECT * from customer_card", BeanPropertyRowMapper.newInstance(CustomerCard.class));
    }
}
