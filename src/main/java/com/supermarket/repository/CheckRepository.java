package com.supermarket.repository;

import com.supermarket.model.Check;

import java.util.List;

public interface CheckRepository {
    /** insert info about new check */
    int save(Check check);

    /** update info about existing check */
    int update(Check check);

    /** find the check by its ID */
    Check findById(String id);

    /** delete the check by its ID */
    int deleteById(String id);

    /** get list of all the checks */
    List<Check> findAll();
}
