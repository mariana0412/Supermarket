package com.supermarket.controller;

import com.supermarket.model.Product;
import com.supermarket.repository.EntityRepositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api")

public class ProductController {
    @Autowired
    ProductRepository productRepository;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts(@RequestParam(required = false) boolean sorted,
                                                        @RequestParam(required = false) Integer catId,
                                                        @RequestParam(required = false) String name) {
        List<Product> products;
        try {
            if(catId != null)
                products = new ArrayList<>(productRepository.findAllFromOneCategorySortedByName(catId));
            else if(sorted)
                products = new ArrayList<>(productRepository.findAllSortedByName());
            else if(name != null)
                products = productRepository.findByName(name);
            else
                products = new ArrayList<>(productRepository.findAll());

            if (products.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            return new ResponseEntity<>(products, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable("id") int id) {
        Product product = productRepository.findById(id);

        if (product != null)
            return new ResponseEntity<>(product, HttpStatus.OK);

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/products")
    public ResponseEntity<String> createProduct(@RequestBody Product product) {
        try {
            productRepository.save(new Product(product.getId_product(), product.getCategory_number(), product.getProduct_name(),
                    product.getProducer(), product.getCharacteristics()));
            return new ResponseEntity<>("Product was created successfully.", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<String> updateProduct(@PathVariable("id") int id, @RequestBody Product product) {
        Product _product = productRepository.findById(id);

        if (_product != null) {
            _product.setId_product(id);
            _product.setCategory_number(product.getCategory_number());
            _product.setProduct_name(product.getProduct_name());
            _product.setProducer(product.getProducer());
            _product.setCharacteristics(product.getCharacteristics());
            productRepository.update(_product);
            return new ResponseEntity<>("Product was updated successfully.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Cannot find Product with id=" + id, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable("id") int id) {
        try {
            productRepository.deleteById(id);
            return new ResponseEntity<>("Product was deleted successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Cannot delete Product.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}