package com.supermarket.controller;

import com.supermarket.model.CustomerCard;
import com.supermarket.repository.EntityRepositories.CustomerCardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api")
public class CustomerCardController {

    @Autowired
    CustomerCardRepository customerCardRepository;

    @GetMapping("/customer-cards")
    public ResponseEntity<List<CustomerCard>> getAllCustomerCards(
            @RequestParam(required = false) boolean sorted,
            @RequestParam(required = false) Integer salePercent,
            @RequestParam(required = false) String surname,
            @RequestParam(required = false) boolean boughtFromEachCategory) {
        List<CustomerCard> customerCards;
        try {
            if(salePercent != null)
                customerCards = customerCardRepository.findAllWithCertainSaleSortedBySurname(salePercent);
            else if(sorted)
                customerCards = customerCardRepository.findAllSortedBySurname();
            else if(surname != null)
                customerCards = customerCardRepository.findBySurname(surname);
            else if(boughtFromEachCategory)
                customerCards = customerCardRepository.findCustomersWhoBoughtFromEachCategory();
            else
                customerCards = customerCardRepository.findAll();

            if (customerCards.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            return new ResponseEntity<>(customerCards, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/customer-cards/{id}")
    public ResponseEntity<CustomerCard> getCustomerCardById(@PathVariable("id") String id) {
        CustomerCard customerCard = customerCardRepository.findById(id);

        if (customerCard != null)
            return new ResponseEntity<>(customerCard, HttpStatus.OK);

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/customer-cards")
    public ResponseEntity<String> createCustomerCard(@RequestBody CustomerCard customerCard) {
        try {
            customerCardRepository.save(new CustomerCard(customerCard.getCust_surname(),
                    customerCard.getCust_name(), customerCard.getCust_patronymic(), customerCard.getPhone_number(),
                    customerCard.getCity(), customerCard.getStreet(), customerCard.getZip_code(),
                    customerCard.getPercent()));
            return new ResponseEntity<>("Customer Card was created successfully.", HttpStatus.CREATED);
        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Violates corporate integrity constraints.", HttpStatus.CONFLICT);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/customer-cards/{id}")
    public ResponseEntity<String> updateCustomerCard(@PathVariable("id") String id, @RequestBody CustomerCard customerCard) {
        CustomerCard _customerCard = customerCardRepository.findById(id);

        if (_customerCard != null) {
            _customerCard.setCard_number(id);
            _customerCard.setCust_surname(customerCard.getCust_surname());
            _customerCard.setCust_name(customerCard.getCust_name());
            _customerCard.setCust_patronymic(customerCard.getCust_patronymic());
            _customerCard.setPhone_number(customerCard.getPhone_number());
            _customerCard.setCity(customerCard.getCity());
            _customerCard.setStreet(customerCard.getStreet());
            _customerCard.setZip_code(customerCard.getZip_code());
            _customerCard.setPercent(customerCard.getPercent());
            try {
                customerCardRepository.update(_customerCard);
            } catch (DataIntegrityViolationException e) {
                e.printStackTrace();
                return new ResponseEntity<>("Violates corporate integrity constraints.", HttpStatus.CONFLICT);
            }
            return new ResponseEntity<>("Customer Card was updated successfully.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Cannot find Customer Card with id=" + id, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/customer-cards/{id}")
    public ResponseEntity<Map<String, Object>> deleteCustomerCard(@PathVariable("id") String id) {
        try {
            customerCardRepository.deleteById(id);
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Customer card was deleted successfully."
            ));
        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "status", "error",
                            "message", "Cannot delete customer card because it has associated checks."
                    ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "An error occurred while deleting the customer card."
                    ));
        }
    }

}
