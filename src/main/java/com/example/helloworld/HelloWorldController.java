package com.example.helloworld;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

@RestController
public class HelloWorldController {

    @RequestMapping("/")
    public String helloWorld() {
        List<String> list = new LinkedList<>();
        String[] ar = new String[5];
        Arrays.stream(ar).toList();

        return "Hello World from Spring Boot";
    }

    @RequestMapping("/goodbye")
    public String goodbye() {
        return "Great job! Goodbye!";
    }
}
