package com.supermarket.repository.JdbcRepositories;

import com.supermarket.model.Query2Model;
import com.supermarket.repository.EntityRepositories.Query2Repository;
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
public class JdbcQuery2Repository implements Query2Repository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void save(Query2Model entity) {

    }

    @Override
    public void update(Query2Model entity) {

    }

    @Override
    public Query2Model findById(String s) {
        return null;
    }

    @Override
    public void deleteById(String s) {

    }

    @Override
    public List<Query2Model> findAll() {
        return null;
    }

    @Override
    public List<Query2Model> getAnswer() {
        return jdbcTemplate.query("SELECT card_number, cust_name, cust_surname\n" +
                "FROM customer_card cc\n" +
                "WHERE NOT EXISTS (SELECT category_number\n" +
                "                 FROM category c\n" +
                "                 WHERE NOT EXISTS (SELECT *\n" +
                "                                  FROM sale s\n" +
                "                                  INNER JOIN receipt r ON r.check_number=s.check_number\n" +
                "                                  INNER JOIN store_product sp ON s.upc=sp.upc\n" +
                "                                  INNER JOIN product p ON p.id_product=sp.id_product\n" +
                "                                  WHERE p.category_number=c.category_number\n" +
                "                                    AND cc.card_number = r.card_number\n" +
                "                                    AND sp.promotional_product=TRUE\n" +
                "                                  )\n" +
                "                 )", new ResultSetExtractor<List<Query2Model>>() {
            @Override
            public List<Query2Model> extractData(ResultSet rs) throws SQLException, DataAccessException {
                List<Query2Model> statsList = new ArrayList<>();
                while (rs.next()) {
                    Query2Model stats = new Query2Model();
                    stats.setCard_number(rs.getString("card_number"));
                    stats.setCust_name(rs.getString("cust_name"));
                    stats.setCust_surname(rs.getString("cust_surname"));
                    statsList.add(stats);
                }
                return statsList;
            }
        });
    }
}
