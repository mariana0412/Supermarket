package com.supermarket.controller;

import com.supermarket.model.Employee;
import com.supermarket.model.TotalSumPerCashier;
import com.supermarket.repository.EntityRepositories.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api")
public class EmployeeController {

    @Autowired
    EmployeeRepository employeeRepository;

    @GetMapping("/employees")
    public ResponseEntity<List<Employee>> getAllEmployees(@RequestParam(required = false) boolean sorted,
                                                          @RequestParam(required = false) boolean cashier) {
        List<Employee> employees;
        try {
            if(sorted && cashier)
                employees = new ArrayList<>(employeeRepository.findAllCashiersSortedBySurname());
            else if(sorted)
                employees = new ArrayList<>(employeeRepository.findAllSortedBySurname());
            else
                employees = new ArrayList<>(employeeRepository.findAll());

            if (employees.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            return new ResponseEntity<>(employees, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/employees/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable("id") String id) {
        Employee employee = employeeRepository.findById(id);

        if (employee != null)
            return new ResponseEntity<>(employee, HttpStatus.OK);

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

   @GetMapping("/employees/contact-info")
    public ResponseEntity<List<Employee.EmployeeContactInfo>> getEmployeeContactInfoBySurname(@RequestParam("surname")
                                                                                                 String surname) {
        List<Employee.EmployeeContactInfo> employeeContactInfos;
        try {
            employeeContactInfos = new ArrayList<>(employeeRepository.findContactInfoBySurname(surname));

            if (employeeContactInfos.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            return new ResponseEntity<>(employeeContactInfos, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/employees/statistics")
    public ResponseEntity<List<TotalSumPerCashier>> getTotalSumPerCashier(
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate) {
        List<TotalSumPerCashier> totalSumsPerEmployee;
        try {
            totalSumsPerEmployee = new ArrayList<>(employeeRepository.getCashierStatistics(startDate, endDate));

            if (totalSumsPerEmployee.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            return new ResponseEntity<>(totalSumsPerEmployee, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/employees")
    public ResponseEntity<String> createEmployee(@RequestBody Employee employee) {
        try {
            employeeRepository.save(new Employee(employee.getEmpl_surname(),
                    employee.getEmpl_name(), employee.getEmpl_patronymic(), employee.getEmpl_role(),
                    employee.getSalary(), employee.getDate_of_birth(), employee.getDate_of_start(),
                    employee.getPhone_number(), employee.getCity(), employee.getStreet(), employee.getZip_code()));
            return new ResponseEntity<>("Employee was created successfully.", HttpStatus.CREATED);
        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Violates corporate integrity constraints.", HttpStatus.CONFLICT);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/employees/{id}")
    public ResponseEntity<String> updateEmployee(@PathVariable("id") String id, @RequestBody Employee employee) {
        Employee _employee = employeeRepository.findById(id);

        if (_employee != null) {
            _employee.setId_employee(id);
            _employee.setEmpl_surname(employee.getEmpl_surname());
            _employee.setEmpl_name(employee.getEmpl_name());
            _employee.setEmpl_patronymic(employee.getEmpl_patronymic());
            _employee.setEmpl_role(employee.getEmpl_role());
            _employee.setSalary(employee.getSalary());
            _employee.setDate_of_birth(employee.getDate_of_birth());
            _employee.setDate_of_start(employee.getDate_of_start());
            _employee.setPhone_number(employee.getPhone_number());
            _employee.setCity(employee.getCity());
            _employee.setStreet(employee.getStreet());
            _employee.setZip_code(employee.getZip_code());
            try {
                employeeRepository.update(_employee);
            } catch (DataIntegrityViolationException e) {
                e.printStackTrace();
                return new ResponseEntity<>("Violates corporate integrity constraints.", HttpStatus.CONFLICT);
            }
            return new ResponseEntity<>("Employee was updated successfully.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Cannot find Employee with id=" + id, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/employees/{id}")
    public ResponseEntity<Map<String, Object>> deleteEmployee(@PathVariable("id") String id) {
        try {
            employeeRepository.deleteById(id);
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Employee was deleted successfully."
            ));
        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "status", "error",
                            "message", "Cannot delete employee because they have associated checks."
                    ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "An error occurred while deleting the employee."
                    ));
        }
    }

}