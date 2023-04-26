package com.supermarket.controller;

import com.supermarket.model.DateMaxModel;
import com.supermarket.repository.EntityRepositories.DateMaxRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/api")
public class DateMaxProductController {
    @Autowired
    DateMaxRepository dateMaxRepository;

    @GetMapping("/dateMaxProduct")
    public ResponseEntity<List<DateMaxModel>> getProductById() {
        List<DateMaxModel> answer = dateMaxRepository.getAnswer();

        if (answer != null)
            return new ResponseEntity<>(answer, HttpStatus.OK);

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
