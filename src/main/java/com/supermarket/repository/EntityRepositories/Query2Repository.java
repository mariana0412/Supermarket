package com.supermarket.repository.EntityRepositories;

import com.supermarket.model.Query2Model;
import com.supermarket.repository.CrudRepository;

import java.util.List;

public interface Query2Repository extends CrudRepository<Query2Model, String> {
    List<Query2Model> getAnswer();
}
