package com.supermarket.repository;

import com.supermarket.model.Check;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
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

    // TODO: it should join Sale, think about where it is called
    // 17. Get information about all checks created by a certain cashier for a certain period of time
    // (with the possibility of viewing the purchased goods in this check, their names, quantities and prices)
    @Override
    public List<Check> findAllByCashierAndTimePeriod(String cashierId, LocalDateTime startDate, LocalDateTime endDate) {
        return jdbcTemplate.query("SELECT * FROM receipt WHERE id_employee=? AND print_date BETWEEN ? AND ?",
                BeanPropertyRowMapper.newInstance(Check.class), cashierId, startDate, endDate);
    }

    // TODO: it should join Sale, think about where it is called
    // 18. Get information about all checks created by all cashiers for a certain period of time
    // (with the possibility of viewing the purchased goods in this check, their name, quantity and prices)
    @Override
    public List<Check> findAllByTimePeriod(LocalDateTime startDate, LocalDateTime endDate) {
        return jdbcTemplate.query("SELECT * FROM receipt WHERE print_date BETWEEN ? AND ?",
                BeanPropertyRowMapper.newInstance(Check.class), startDate, endDate);
    }

    // 19. Determine the total sum of goods sold from checks created by a certain cashier for a certain period of time
    @Override
    public double getTotalSumOfProductsSoldByCashierForTimePeriod(String cashierId, LocalDateTime startDate,
                                                                  LocalDateTime endDate) {
        String query =
                "SELECT SUM(sum_total) " +
                "FROM receipt " +
                "WHERE id_employee=? " +
                "AND print_date BETWEEN ? AND ?";
        Double sum = jdbcTemplate.queryForObject(query, Double.class, cashierId, startDate, endDate);
        return sum != null ? sum : 0;
    }

    // 20. Determine the total sum of goods sold from checks created by all cashiers for a certain period of time
    @Override
    public double getTotalSumOfProductsSoldForTimePeriod(LocalDateTime startDate, LocalDateTime endDate) {
        String query =
                "SELECT SUM(sum_total) " +
                "FROM receipt " +
                "WHERE print_date BETWEEN ? AND ?";
        Double sum = jdbcTemplate.queryForObject(query, Double.class, startDate, endDate);
        return sum != null ? sum : 0;
    }
}
