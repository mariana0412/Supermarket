package com.supermarket.repository;

import com.supermarket.model.Check;

import java.time.LocalDateTime;
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

    /** get list of all the checks for a certain period of time */
    List<Check> findAllByTimePeriod(LocalDateTime startDate, LocalDateTime endDate);

    /** get list of all the checks for a certain period of time */
    List<Check> findAllByCashierAndTimePeriod(String cashierId, LocalDateTime startDate, LocalDateTime endDate);
}
