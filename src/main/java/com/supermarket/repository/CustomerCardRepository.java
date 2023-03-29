package com.supermarket.repository;

import com.supermarket.model.CustomerCard;

import java.util.List;

public interface CustomerCardRepository {

    /** insert info about new customer */
    int save(CustomerCard customerCard);

    /** update info about existing customer */
    int update(CustomerCard customerCard);

    /** find the customer by their ID */
    CustomerCard findById(String id);

    /** delete the customer by their ID */
    int deleteById(String id);

    /** get list of all the customers */
    List<CustomerCard> findAll();

    /** get list of all the customers, sorted alphabetically by surname */
    List<CustomerCard> findAllSorted();

}
