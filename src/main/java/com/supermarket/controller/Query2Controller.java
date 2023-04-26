package com.supermarket.controller;

import com.supermarket.model.Query2Model;
import com.supermarket.repository.EntityRepositories.Query2Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class Query2Controller {

    @Autowired
    Query2Repository query2Repository;

    @GetMapping("/query2")
    public ResponseEntity<List<Query2Model>> getProductById(
            @PathVariable("c") String c
    ) {
        List<Query2Model> product = query2Repository.getAnswer();

        if (product != null)
            return new ResponseEntity<>(product, HttpStatus.OK);

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
