package com.supermarket.controller;

import com.supermarket.model.StoreProduct;
import com.supermarket.repository.StoreProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api")
public class StoreProductController {
    @Autowired
    StoreProductRepository storeProductRepository;

    @GetMapping("/store-products")
    public ResponseEntity<List<StoreProduct>> getAllStoreProducts(@RequestParam(required = false) boolean sorted) {
        List<StoreProduct> storeProducts;
        try {
            if(sorted)
                storeProducts = new ArrayList<>(storeProductRepository.findAllSorted());
            else
                storeProducts = new ArrayList<>(storeProductRepository.findAll());

            if (storeProducts.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            return new ResponseEntity<>(storeProducts, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/store-products/{id}")
    public ResponseEntity<StoreProduct> getStoreProductById(@PathVariable("id") String id) {
        StoreProduct storeProduct = storeProductRepository.findById(id);

        if (storeProduct != null)
            return new ResponseEntity<>(storeProduct, HttpStatus.OK);

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/store-products")
    public ResponseEntity<String> createStoreProduct(@RequestBody StoreProduct storeProduct) {
        System.out.println(storeProduct);
        try {
            storeProductRepository.save(new StoreProduct(storeProduct.getUPC(), storeProduct.getUPC_prom(),
                    storeProduct.getId_product(), storeProduct.getSelling_price(), storeProduct.getProducts_number(),
                    storeProduct.isPromotional_product()));
            return new ResponseEntity<>("Store Product was created successfully.", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/store-products/{id}")
    public ResponseEntity<String> updateStoreProduct(@PathVariable("id") String id, @RequestBody StoreProduct storeProduct) {
        StoreProduct _storeProduct = storeProductRepository.findById(id);

        if (_storeProduct != null) {
            _storeProduct.setUPC(id);
            _storeProduct.setUPC_prom(storeProduct.getUPC_prom());
            _storeProduct.setId_product(storeProduct.getId_product());
            _storeProduct.setSelling_price(storeProduct.getSelling_price());
            _storeProduct.setProducts_number(storeProduct.getProducts_number());
            _storeProduct.setPromotional_product(storeProduct.isPromotional_product());
            storeProductRepository.update(_storeProduct);
            return new ResponseEntity<>("Store Product was updated successfully.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Cannot find Store Product with id=" + id, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/store-products/{id}")
    public ResponseEntity<String> deleteStoreProduct(@PathVariable("id") String id) {
        try {
            int result = storeProductRepository.deleteById(id);
            if (result == 0) {
                return new ResponseEntity<>("Cannot find Store Product with id=" + id, HttpStatus.OK);
            }
            return new ResponseEntity<>("Store Product was deleted successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Cannot delete Store Product.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
