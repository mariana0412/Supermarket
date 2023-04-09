package com.supermarket.controller;

import com.supermarket.model.Sale;
import com.supermarket.repository.EntityRepositories.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api")
public class SaleController {
    @Autowired
    SaleRepository saleRepository;

    @PostMapping("/sales")
    public ResponseEntity<String> createSale(@RequestBody Sale sale) {
        try {
            saleRepository.save(new Sale(sale.getUPC(), sale.getCheck_number(), sale.getProduct_number(),
                    sale.getSelling_price()));
            return new ResponseEntity<>("Sale was created successfully.", HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
