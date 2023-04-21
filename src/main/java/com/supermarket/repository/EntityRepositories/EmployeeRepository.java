package com.supermarket.repository.EntityRepositories;

import com.supermarket.model.Employee;
import com.supermarket.repository.CrudRepository;
import java.util.List;

public interface EmployeeRepository extends CrudRepository<Employee, String> {
    List<Employee> findAllSortedBySurname();
    List<Employee> findAllCashiersSortedBySurname();
    List<Employee.EmployeeContactInfo> findContactInfoBySurname(String surname);
}
