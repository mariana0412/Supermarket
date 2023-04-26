package com.supermarket.repository.EntityRepositories;

import com.supermarket.model.DateMaxModel;
import com.supermarket.repository.CrudRepository;

import java.util.List;

public interface DateMaxRepository extends CrudRepository<DateMaxModel, String> {
    List<DateMaxModel> getAnswer(String city);
}
