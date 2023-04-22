package com.supermarket.controller;

import com.supermarket.model.Sale;
import com.supermarket.repository.EntityRepositories.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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
        } catch (DuplicateKeyException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Sale with this store product already exists in this check.", HttpStatus.CONFLICT);
        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Violates corporate integrity constraints.", HttpStatus.CONFLICT);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/sales")
    public ResponseEntity<List<Sale.ProductNameNumberPrice>> getPurchasedProductsInCheck(@RequestParam String checkNumber) {
        List<Sale.ProductNameNumberPrice> purchasedProducts;
        try {
            purchasedProducts = saleRepository.findPurchasedProductsInCheck(checkNumber);

            if (purchasedProducts.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            return new ResponseEntity<>(purchasedProducts, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
