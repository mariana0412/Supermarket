package com.supermarket.security.user;

import java.util.Optional;

public interface UserRepository {
    Optional<User> findByPhoneNumber(String phoneNumber);
    void save(User user);
}
