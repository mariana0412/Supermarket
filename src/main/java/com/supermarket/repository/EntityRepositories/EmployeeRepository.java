package com.supermarket.repository.EntityRepositories;

import com.supermarket.model.Employee;
import com.supermarket.model.TotalSumPerCashier;
import com.supermarket.repository.CrudRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface EmployeeRepository extends CrudRepository<Employee, String> {
    List<Employee> findAllSortedBySurname();
    List<Employee> findAllCashiersSortedBySurname();
    List<Employee.EmployeeContactInfo> findContactInfoBySurname(String surname);
    List<TotalSumPerCashier> getCashierStatistics(LocalDateTime startDate, LocalDateTime endDate);
}
