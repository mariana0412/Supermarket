package com.supermarket.security.user;

import com.supermarket.model.Employee;

public interface UserRepository {
    User findByPhoneNumber(String phoneNumber);
    void save(User user);
    Employee findEmployeeByPhoneNumber(String phoneNumber);
}
