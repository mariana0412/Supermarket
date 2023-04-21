package com.supermarket.repository.JdbcRepositories;

import com.supermarket.repository.EntityRepositories.EmployeeRepository;
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
    public void save(Employee employee) {
        jdbcTemplate.update("INSERT INTO employee (id_employee, empl_surname, empl_name, empl_patronymic, " +
                        "empl_role, salary, date_of_birth, date_of_start, phone_number, city, street, zip_code) " +
                        "VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
                employee.getId_employee(), employee.getEmpl_surname(), employee.getEmpl_name(),
                employee.getEmpl_patronymic(), employee.getEmpl_role(), employee.getSalary(),
                employee.getDate_of_birth(), employee.getDate_of_start(), employee.getPhone_number(),
                employee.getCity(), employee.getStreet(), employee.getZip_code());
    }

    @Override
    public void update(Employee employee) {
        jdbcTemplate.update("UPDATE employee SET empl_surname=?, empl_name=?, empl_patronymic=?, empl_role=?, " +
                "salary=?, date_of_birth=?, date_of_start=?, phone_number=?, city=?, street=?, zip_code=? " +
                        "WHERE id_employee=?",
                employee.getEmpl_surname(), employee.getEmpl_name(), employee.getEmpl_patronymic(),
                employee.getEmpl_role(), employee.getSalary(), employee.getDate_of_birth(), employee.getDate_of_start(),
                employee.getPhone_number(), employee.getCity(), employee.getStreet(), employee.getZip_code(),
                employee.getId_employee());
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
    public void deleteById(String id) {
        jdbcTemplate.update("DELETE FROM employee WHERE id_employee=?", id);
    }

    @Override
    public List<Employee> findAll() {
        return jdbcTemplate.query("SELECT * FROM employee", BeanPropertyRowMapper.newInstance(Employee.class));
    }

    // M5. Get information about all employees, sorted by surname
    @Override
    public List<Employee> findAllSortedBySurname() {
        return jdbcTemplate.query("SELECT * FROM employee ORDER BY empl_surname",
                BeanPropertyRowMapper.newInstance(Employee.class));
    }

    // M6. Get information about all cashier employees, sorted by surname
    @Override
    public List<Employee> findAllCashiersSortedBySurname() {
        return jdbcTemplate.query("SELECT * FROM employee WHERE empl_role = 'Cashier' ORDER BY empl_surname",
                BeanPropertyRowMapper.newInstance(Employee.class));
    }

    // M11 Search for the employee's phone number and address by last name
    @Override
    public List<Employee.EmployeeContactInfo> findContactInfoBySurname(String surname) {
        try {
            return jdbcTemplate.query("SELECT phone_number, city, street, zip_code FROM employee " +
                            "WHERE empl_surname=?",
                    BeanPropertyRowMapper.newInstance(Employee.EmployeeContactInfo.class), surname);
        } catch (IncorrectResultSizeDataAccessException e) {
            return null;
        }
    }
}
