package com.supermarket.repository.JdbcRepositories;

import com.supermarket.model.DateMaxModel;
import com.supermarket.repository.EntityRepositories.DateMaxRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class JdbcDateMaxRepository implements DateMaxRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public List<DateMaxModel> getAnswer() {
        return jdbcTemplate.query("SELECT print_date, MAX(p_count)  AS max_sells FROM\n" +
                "(SELECT print_date, COUNT(sp.upc) AS p_count\n" +
                "FROM receipt r\n" +
                "INNER JOIN sale s ON s.check_number = r.check_number\n" +
                "INNER JOIN store_product sp ON sp.upc = s.upc\n" +
                "INNER JOIN customer_card cc ON cc.card_number = r.card_number\n" +
                "WHERE city='Lviv'\n" +
                "GROUP BY print_date) date_count\n" +
                "GROUP BY print_date", new ResultSetExtractor<List<DateMaxModel>>() {
            @Override
            public List<DateMaxModel> extractData(ResultSet rs) throws SQLException, DataAccessException {
                List<DateMaxModel> statsList = new ArrayList<>();
                while (rs.next()) {
                    DateMaxModel stats = new DateMaxModel();
                    stats.setPrint_date(rs.getString("print_date"));
                    stats.setMax_sells(rs.getInt("max_sells"));
                    statsList.add(stats);
                }
                return statsList;
            }
        });
    }

    @Override
    public void save(DateMaxModel entity) {

    }

    @Override
    public void update(DateMaxModel entity) {

    }

    @Override
    public DateMaxModel findById(String s) {
        return null;
    }

    @Override
    public void deleteById(String s) {

    }

    @Override
    public List<DateMaxModel> findAll() {
        return null;
    }


}
