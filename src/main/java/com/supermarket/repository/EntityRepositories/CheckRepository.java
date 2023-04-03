package com.supermarket.repository.EntityRepositories;

import com.supermarket.model.Check;
import com.supermarket.repository.CrudRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface CheckRepository extends CrudRepository<Check, String> {
    List<Check> findAllPrintedByCashierWithinTimePeriod(String cashierId, LocalDateTime startDate,
                                                        LocalDateTime endDate);
    List<Check> findAllPrintedWithinTimePeriod(LocalDateTime startDate, LocalDateTime endDate);
    double getTotalSumOfProductsSoldByCashierForTimePeriod(String cashierId, LocalDateTime startDate,
                                                           LocalDateTime endDate);
    double getTotalSumOfProductsSoldForTimePeriod(LocalDateTime startDate, LocalDateTime endDate);
}
