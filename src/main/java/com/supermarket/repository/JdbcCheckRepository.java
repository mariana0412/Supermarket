package com.supermarket.repository;

import com.supermarket.model.Check;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class JdbcCheckRepository implements CheckRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public int save(Check check) {
        return jdbcTemplate.update("INSERT INTO receipt (check_number, id_employee, " +
                "card_number, print_date, sum_total, vat) " +
                        "VALUES(?,?,?,?,?,?)",
                check.getCheck_number(), check.getId_employee(), check.getCard_number(), check.getPrint_date(),
                check.getSum_total(), check.getVat());
    }

    @Override
    public int update(Check check) {
        return jdbcTemplate.update("UPDATE receipt SET id_employee=?, card_number=?, print_date=?, sum_total=?, " +
                        "vat=? WHERE check_number=?",
                check.getId_employee(), check.getCard_number(), check.getPrint_date(),
                check.getSum_total(), check.getVat(), check.getCheck_number());
    }

    @Override
    public Check findById(String id) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM receipt WHERE check_number=?",
                    BeanPropertyRowMapper.newInstance(Check.class), id);
        } catch (IncorrectResultSizeDataAccessException e) {
            return null;
        }
    }

    @Override
    public int deleteById(String id) {
        return jdbcTemplate.update("DELETE FROM receipt WHERE check_number=?", id);
    }

    @Override
    public List<Check> findAll() {
        return jdbcTemplate.query("SELECT * FROM receipt", BeanPropertyRowMapper.newInstance(Check.class));
    }
}
