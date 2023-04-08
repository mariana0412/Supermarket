package com.supermarket.controller;

import com.supermarket.model.StoreProduct;
import com.supermarket.repository.EntityRepositories.StoreProductRepository;
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
public class StoreProductController {
    @Autowired
    StoreProductRepository storeProductRepository;

    @GetMapping("/store-products")
    public ResponseEntity<List<StoreProduct>> getAllStoreProducts(@RequestParam(required = false) boolean sortedByNum,
                                                                  @RequestParam(required = false) boolean promSortedByNum,
                                                                  @RequestParam(required = false) boolean promSortedByName,
                                                                  @RequestParam(required = false) boolean notPromSortedByNum,
                                                                  @RequestParam(required = false) boolean notPromSortedByName) {
        List<StoreProduct> storeProducts;
        try {
            if(sortedByNum)
                storeProducts = storeProductRepository.findAllSortedByNumber();
            else if(promSortedByNum)
                storeProducts = storeProductRepository.findAllPromotionalSortedByNumber();
            else if(promSortedByName)
                storeProducts = storeProductRepository.findAllPromotionalSortedByName();
            else if(notPromSortedByNum)
                storeProducts = storeProductRepository.findAllNotPromotionalSortedByNumber();
            else if(notPromSortedByName)
                storeProducts = storeProductRepository.findAllNotPromotionalSortedByName();
            else
                storeProducts = storeProductRepository.findAll();

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

    @GetMapping("/store-products-details/{id}")
    public ResponseEntity<StoreProduct.StoreProductDetails> getStoreProductDetailsById(@PathVariable("id") String id) {
        StoreProduct.StoreProductDetails storeProduct = storeProductRepository.findDetailsByUPC(id);

        if (storeProduct != null)
            return new ResponseEntity<>(storeProduct, HttpStatus.OK);

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/store-products")
    public ResponseEntity<String> createStoreProduct(@RequestBody StoreProduct storeProduct) {
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
    public ResponseEntity<Map<String, Object>> deleteStoreProduct(@PathVariable("id") String id) {
        try {
            storeProductRepository.deleteById(id);
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Store Product was deleted successfully."
            ));
        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "status", "error",
                            "message", "Cannot delete store product because it has associated sales."
                    ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "An error occurred while deleting the store product."
                    ));
        }
    }

}
