package com.supermarket.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.supermarket.model.Employee;

import java.util.List;

@Repository
public class JdbcEmployeeRepository implements EmployeeRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public int save(Employee employee) {
        return jdbcTemplate.update("INSERT INTO employee (id_employee, empl_surname, empl_name, empl_patronymic, " +
                        "empl_role, salary, date_of_birth, date_of_start, phone_number, city, street, zip_code) " +
                        "VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
                employee.getId_employee(), employee.getEmpl_surname(), employee.getEmpl_name(), employee.getEmpl_patronymic(),
                employee.getEmpl_role(), employee.getSalary(), employee.getDate_of_birth(), employee.getDate_of_start(),
                employee.getPhone_number(), employee.getCity(), employee.getStreet(), employee.getZip_code());
    }

    @Override
    public int update(Employee employee) {
        return jdbcTemplate.update("UPDATE employee SET empl_surname=?, empl_name=?, empl_patronymic=?, empl_role=?, " +
                "salary=?, date_of_birth=?, date_of_start=?, phone_number=?, city=?, street=?, zip_code=? WHERE id_employee=?",
                employee.getEmpl_surname(), employee.getEmpl_name(), employee.getEmpl_patronymic(),
                employee.getEmpl_role(), employee.getSalary(), employee.getDate_of_birth(), employee.getDate_of_start(),
                employee.getPhone_number(), employee.getCity(), employee.getStreet(), employee.getZip_code(), employee.getId_employee());
    }

    @Override
    public Employee findById(String id) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM employee WHERE id_employee=?",
                    BeanPropertyRowMapper.newInstance(Employee.class), id);
        } catch (IncorrectResultSizeDataAccessException e) {
            return null;
        }
    }

    @Override
    public int deleteById(String id) {
        return jdbcTemplate.update("DELETE FROM employee WHERE id_employee=?", id);
    }

    @Override
    public List<Employee> findAll() {
        return jdbcTemplate.query("SELECT * from employee", BeanPropertyRowMapper.newInstance(Employee.class));
    }
}
