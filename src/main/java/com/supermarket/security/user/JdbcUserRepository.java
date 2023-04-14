package com.supermarket.security.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class JdbcUserRepository implements UserRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public Optional<User> findByPhoneNumber(String phoneNumber) {
        User user;
        try {
            user = jdbcTemplate.queryForObject("SELECT * FROM _user WHERE phone_number=?",
                    BeanPropertyRowMapper.newInstance(User.class), phoneNumber);
        } catch (IncorrectResultSizeDataAccessException e) {
            e.printStackTrace();
            return Optional.empty();
        }
        return Optional.ofNullable(user);
    }

    @Override
    public void save(User user) {
        jdbcTemplate.update("INSERT INTO _user (phone_number, user_password) VALUES(?,?)",
                user.getPhone_number(), user.getUser_password());
    }
}
