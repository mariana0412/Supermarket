package com.supermarket.repository.EntityRepositories;

import com.supermarket.model.CustomerCard;
import com.supermarket.repository.CrudRepository;
import java.util.List;

public interface CustomerCardRepository extends CrudRepository<CustomerCard, String> {
    List<CustomerCard> findAllSortedBySurname();
    List<CustomerCard> findAllWithCertainSaleSortedBySurname(double salePercent);
}