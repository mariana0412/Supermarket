package com.supermarket.repository;

import java.util.List;

public interface CrudRepository<T, ID> {
    void save(T entity);
    void update(T entity);
    T findById(ID id);
    void deleteById(ID id);
    List<T> findAll();
}