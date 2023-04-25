package com.supermarket.security.user;

import com.supermarket.model.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcUserRepository implements UserRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public User findByPhoneNumber(String phoneNumber) {
        try {
            User user = jdbcTemplate.queryForObject("SELECT * FROM _user WHERE phone_number=?",
                    BeanPropertyRowMapper.newInstance(com.supermarket.security.user.User.class), phoneNumber);
            if(user == null)
                return null;
            String role = findEmployeeByPhoneNumber(phoneNumber).getEmpl_role();
            if(role.equals("Manager"))
                user.setRole(UserRole.MANAGER);
            else
                user.setRole(UserRole.CASHIER);
            return user;
        }
        catch (EmptyResultDataAccessException e){
            e.printStackTrace();
            return null;
        }
        catch (IncorrectResultSizeDataAccessException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public void save(User user) {
        jdbcTemplate.update("INSERT INTO _user (phone_number, user_password) VALUES(?,?)",
                user.getPhone_number(), user.getUser_password());
    }

    @Override
    public Employee findEmployeeByPhoneNumber(String phoneNumber) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM employee WHERE phone_number=?",
                    BeanPropertyRowMapper.newInstance(Employee.class), phoneNumber);
        } catch (IncorrectResultSizeDataAccessException e) {
            e.printStackTrace();
            return null;
        }
    }
}
