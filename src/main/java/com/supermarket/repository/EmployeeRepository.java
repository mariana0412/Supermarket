package com.supermarket.repository;

import com.supermarket.model.Employee;
import java.util.List;

public interface EmployeeRepository {
    /** insert info about new employee */
    int save(Employee employee);

    /** update info about existing employee */
    int update(Employee employee);

    /** find the employee by their ID */
    Employee findById(String id);

    /** delete the employee by their ID */
    int deleteById(String id);

    /** get list of all the employees */
    List<Employee> findAll();

    /** get list of all the employees, sorted alphabetically by surname */
    List<Employee> findAllSorted();

    /** get list of all the employees whose profession is a cashier, sorted alphabetically by surname */
    List<Employee> findAllSortedCashiers();
}
